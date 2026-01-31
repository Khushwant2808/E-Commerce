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
    const { search, minPrice, maxPrice } = req.query;
    const where = { isActive: true };

    if (search) {
      where.name = { [Op.iLike]: `%${search}%` };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
    }

    const { count, rows } = await Product.findAndCountAll({
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]]
    });

    return res.status(200).json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      products: rows
    });
  } catch (error) {
    next(error);
  }
}

async function getProductById(req, res, next) {
  try {
    const { id } = req.params;

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
      return res.status(404).json({ message: "Product not found" });
    }

    if (!product.isActive) {
      const isOwner = req.user && (req.user.id === product.userId || req.user.role === 'admin');

      if (!isOwner) {
        return res.status(404).json({ message: "Product not available" });
      }
    }

    return res.status(200).json(product);
  } catch (error) {
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
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.userId !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (stock < 0) {
      return res.status(400).json({ message: "Stock cannot be negative" });
    }

    product.stock = stock;
    await product.save();

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
      return res.status(403).json({ message: "You are not authorized to update this product" });
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

    return res.status(200).json({ message: "Product deleted successfully" });
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
