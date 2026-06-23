const { readDB, writeDB } = require("../config/db-helper");
const fs = require("fs");
const path = require("path");
const { body, validationResult } = require("express-validator");

// Validation rules for product
exports.productValidationRules = [
  body("name").trim().notEmpty().withMessage("Product name is required"),
  body("price").isFloat({ min: 0 }).withMessage("Price must be a positive number"),
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("stock").isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),
  body("description").optional().trim()
];

// ==========================
// GET ALL PRODUCTS
// ==========================
exports.getProducts = (req, res) => {
  const data = readDB();
  res.json(data.products);
};

// ==========================
// GET PRODUCT BY ID
// ==========================
exports.getProductById = (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  const data = readDB();
  const product = data.products.find(p => p.id === id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.json(product);
};

// ==========================
// ADD PRODUCT
// ==========================
exports.addProduct = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const data = readDB();
  const newId = data.products.length > 0 ? Math.max(...data.products.map(p => p.id)) + 1 : 1;

  const newProduct = {
    id: newId,
    name: req.body.name,
    price: req.body.price,
    category: req.body.category,
    stock: req.body.stock,
    description: req.body.description || "",
    image: req.file ? req.file.filename : ""
  };

  data.products.push(newProduct);
  writeDB(data);
  res.json({ message: "Product Added Successfully" });
};

// ==========================
// UPDATE PRODUCT
// ==========================
exports.updateProduct = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const id = Number(req.params.id);
  const data = readDB();
  const productIndex = data.products.findIndex(p => p.id === id);

  if (productIndex === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  const updatedProduct = {
    ...data.products[productIndex],
    name: req.body.name,
    price: req.body.price,
    category: req.body.category,
    stock: req.body.stock,
    description: req.body.description || ""
  };

  if (req.file) {
    updatedProduct.image = req.file.filename;
  }

  data.products[productIndex] = updatedProduct;
  writeDB(data);

  res.json({ message: "Product Updated Successfully" });
};

// ==========================
// DELETE PRODUCT
// ==========================
exports.deleteProduct = (req, res) => {
  const id = Number(req.params.id);
  const data = readDB();
  const productIndex = data.products.findIndex(p => p.id === id);

  if (productIndex === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  // Delete image file if exists
  const product = data.products[productIndex];
  if (product.image) {
    const imagePath = path.join(__dirname, "../uploads", product.image);
    fs.unlink(imagePath, (err) => {
      if (err) console.log("Image not deleted:", err.message);
    });
  }

  data.products.splice(productIndex, 1);
  writeDB(data);
  res.json({ message: "Product Deleted Successfully" });
};
