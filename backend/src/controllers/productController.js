require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const Product = require("../models/Product");

async function addProduct(req, res) {
    try {
        const { name, description, price, stock,imageUrl } = req.body;
        if(!name || !price) {
            return res.status(400).json({ message: "Name and Price are required" });
        }

        const product = await Product.create({
            name,
            description,
            price,
            stock,
            imageUrl
        });

        if (process.env.LOG !== "false"){
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
