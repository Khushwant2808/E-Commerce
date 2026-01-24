const Product = require("../models/Product");

async function addProduct(req, res) {
    try {
        const { name, description, price, stock, imageUrl } = req.body;
        const userId = req.user.id
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
            console.log("Product Added")
        };

        return res.status(201).json({
            message: "Product added successfully",
            product
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

async function getProducts(req, res) {
    try {
        const products = await Product.findAll();
        if (!products.length) {
            return res.status(404).json({ message: "No products found" });
        }
        return res.status(200).json(products);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

async function getProductById(req, res) {
    try {
        const { id } = req.params;
        if (!id || isNaN(id)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.status(200).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = {
    addProduct,
    getProducts,
    getProductById
};  
