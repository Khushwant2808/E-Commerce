const { Product } = require("../models");
const { Op } = require("sequelize");

async function addProduct(req, res, next) {
  try {
    const { name, description, price, stock, imageUrl } = req.body;
    const userId = req.user.id;

    if (!name || !price || !userId) {
      return res.status(400).json({ message: "Name and Price and User are required" });
    }

    if (typeof price !== "number" || price <= 0) {
      return res.status(400).json({ message: "Price must be a positive number" });
    }

    if (stock !== undefined && (typeof stock !== "number" || stock < 0)) {
      return res.status(400).json({ message: "Stock must be a non-negative number" });
    }

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      imageUrl,
      userId
    });

    if (process.env.LOG !== "false") {
      console.log("Product Added");
    }

    return res.status(201).json({
      message: "Product added successfully",
      product
    });
  } catch (error) {
    next(error);
  }
}

async function getProducts(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (page < 1) return res.status(400).json({ message: "Page must be >= 1" });
    if (limit < 1) limit = 10;

    const offset = (page - 1) * limit;
    const { search, minPrice, maxPrice, category } = req.query;
    const where = { isActive: true }; // Only show active products to users

    if (search) {
      where.name = { [Op.iLike]: `%${search}%` };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
    }

    console.log('[Products] Search query:', { search, minPrice, maxPrice, page, limit });

    const { count, rows } = await Product.findAndCountAll({
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]]
    });

    console.log('[Products] Found', count, 'products');

    // Return empty array instead of 404 for better UX
    return res.status(200).json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      products: rows
    });
  } catch (error) {
    console.error('[Products] Error fetching products:', error.message);
    next(error);
  }
}

async function getProductById(req, res, next) {
  try {
    const { id } = req.params;
    console.log('[Products] Fetching product by ID:', id);

    const product = await Product.findOne({
      where: { id },
      include: [
        {
          association: 'User',
          attributes: ['id', 'name']
        }
      ]
    });

    if (!product) {
      console.log('[Products] Product not found:', id);
      return res.status(404).json({ message: "Product not found" });
    }

    if (!product.isActive) {
      console.log('[Products] Product is inactive:', id);
      return res.status(404).json({ message: "Product not available" });
    }

    console.log('[Products] Product fetched successfully:', product.name);
    return res.status(200).json(product);
  } catch (error) {
    console.error('[Products] Error fetching product:', error.message);
    next(error);
  }
}

async function showProducts(req, res, next) {
  try {
    const userId = req.user.id;
    const products = await Product.findAll({ where: { userId } });

    if (!products.length) {
      return res.status(404).json({ message: "No products found" });
    }

    return res.status(200).json(products);
  } catch (error) {
    next(error);
  }
}

async function updateStock(req, res, next) {
  try {
    const { id, stock } = req.body;
    const userId = req.user.id;
    const product = await Product.findByPk(id);

    if (typeof stock !== "number") {
      return res.status(400).json({ message: "Stock must be a number" });
    }

    if (!product) {
      return res.status(404).json({ message: "Product not found or stock not provided" });
    }

    if (product.userId !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const newStock = product.stock + stock;
    if (newStock < 0) {
      return res.status(400).json({
        message: `Insufficient stock. Current: ${product.stock}, Requested reduction: ${Math.abs(stock)}`
      });
    }

    product.stock += stock;
    await product.save();
    if (product.stock < 0) product.stock = 0;

    if (process.env.LOG !== "false") {
      console.log("Stock Updated");
    }

    return res.status(200).json({
      message: "Stock updated successfully",
      product
    });
  } catch (error) {
    next(error);
  }
}

async function updateProductMeta(req, res, next) {
  try {
    const { id, imageUrl, price, isActive, isFeatured, description } = req.body;
    const userId = req.user.id;

    if (!id) {
      return res.status(400).json({ message: "Product ID required" });
    }

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.userId !== userId) {
      console.log('[Products] Unauthorized update attempt by user:', userId, 'on product:', id);
      return res.status(403).json({ message: "You are not authorized to update this product" });
    }

    if (
      imageUrl === undefined &&
      isActive === undefined &&
      isFeatured === undefined &&
      description === undefined &&
      price === undefined
    ) {
      return res.status(400).json({ message: "No fields provided for update" });
    }

    if (imageUrl !== undefined) product.imageUrl = imageUrl;
    if (isActive !== undefined) product.isActive = isActive;
    if (price !== undefined) product.price = price;
    if (isFeatured !== undefined) product.isFeatured = isFeatured;
    if (description !== undefined) product.description = description;

    await product.save();

    if (process.env.LOG !== "false") {
      console.log("Product meta updated", id);
    }

    return res.status(200).json({
      message: "Product meta updated successfully",
      product
    });
  } catch (error) {
    next(error);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.userId !== userId) {
      return res.status(403).json({ message: "Not authorized to delete this product" });
    }

    await product.destroy();

    return res.status(200).json({ message: "Product deleted (softly)" });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  addProduct,
  getProducts,
  getProductById,
  updateStock,
  showProducts,
  deleteProduct,
  updateProductMeta
};
