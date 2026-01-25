const {Product} = require("../models");

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

async function showProducts(req, res) {
    try {
        const userId = req.user.id;
        const products = await Product.findAll({where:{userId}});
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

async function updateStock(req, res) {
    try{
        const {id, stock} = req.body;
        const userId = req.user.id;
        const product = await Product.findByPk(id);
        if(!product){
            return res.status(404).json({message: "Product not found or stock not provided"});
        }
        if (product.userId !== userId){
            return res.status(400).json({ message: "Product Not yours bitch"})
          }
        if(typeof stock !== "number" || stock <=0){
            return res.status(400).json({message: "Stock must be a positive number"});
        }
        product.stock += stock;
        await product.save();
        if(process.env.LOG !== "false"){
            console.log("Stock Updated");
        }
        return res.status(200).json({
            message: "Stock updated successfully",
            product
        });
    }
    catch(error){
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

async function updateProductMeta(req, res) {
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
      if (product.userId !== userId){
        return res.status(400).json({ message: "Product Not yours bitch"})
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
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  }
  

module.exports = {
    addProduct,
    getProducts,
    updateStock,
    showProducts,
    updateProductMeta
};  
