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
        const offset = (page - 1) * limit;

        const { search, minPrice, maxPrice, category } = req.query;
        const where = {};

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

        if (!rows.length) {
            return res.status(404).json({ message: "No products found" });
        }

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
        if (!product) {
            return res.status(404).json({ message: "Product not found or stock not provided" });
        }
        if (product.userId !== userId) {
            return res.status(400).json({ message: "Product Not yours bitch" });
        }
        if (typeof stock !== "number" || stock <= 0) {
            return res.status(400).json({ message: "Stock must be a positive number" });
        }
        product.stock += stock;
        await product.save();
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
        const { id, imageUrl, isActive, isFeatured, description } = req.body;
        const userId = req.user.id;

        if (!id) {
            return res.status(400).json({ message: "Product ID required" });
        }

        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        if (product.userId !== userId) {
            return res.status(400).json({ message: "Product Not yours bitch" });
        }

        if (
            imageUrl === undefined &&
            isActive === undefined &&
            isFeatured === undefined &&
            description === undefined
        ) {
            return res.status(400).json({ message: "No fields provided for update" });
        }

        if (imageUrl !== undefined) product.imageUrl = imageUrl;
        if (isActive !== undefined) product.isActive = isActive;
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
    updateStock,
    showProducts,
    deleteProduct,
    updateProductMeta
};
