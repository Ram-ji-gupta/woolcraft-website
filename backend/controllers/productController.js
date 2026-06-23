const db = require("../config/db");
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
  // Primary source: MySQL table `products`
  db.query(
    "SELECT * FROM products ORDER BY id DESC",
    (err, result) => {
      if (err) {
        console.error("Error fetching products:", err);
        return res.status(500).json({ message: "Failed to fetch products" });
      }

      if (Array.isArray(result) && result.length > 0) {
        return res.json(result);
      }

      // Fallback: local JSON (useful for dev when MySQL is empty/broken)
      try {
        const fallbackPath = path.join(__dirname, "../db.json");
        const fallback = require(fallbackPath);
        const fallbackProducts = Array.isArray(fallback?.products) ? fallback.products : [];
        return res.json(fallbackProducts);
      } catch (e) {
        console.error("Fallback failed:", e);
        return res.json([]);
      }
    }
  );
};


// ==========================
// GET PRODUCT BY ID
// ==========================

exports.getProductById = (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  db.query(
    "SELECT * FROM products WHERE id=?",
    [id],
    (err, result) => {
      if (err) {
        console.error("Error fetching product:", err);
        return res.status(500).json({ message: "Failed to fetch product" });
      }

      if (result.length > 0) {
        return res.json(result[0]);
      }

      // Fallback to db.json
      try {
        const fallbackPath = path.join(__dirname, "../db.json");
        const fallback = require(fallbackPath);
        const fallbackProducts = Array.isArray(fallback?.products) ? fallback.products : [];
        
        const p = fallbackProducts.find(x => Number(x.id) === id);
        if (p) {
          return res.json(p);
        }
      } catch (e) {
        console.error("Fallback failed:", e);
      }

      return res.status(404).json({ message: "Product not found" });
    }
  );
};


// ==========================
// ADD PRODUCT
// ==========================

exports.addProduct = (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, price, category, stock, description } = req.body;
  const image = req.file ? req.file.filename : "";

  db.query(
    "INSERT INTO products (name, price, category, stock, image, description) VALUES (?, ?, ?, ?, ?, ?)",
    [name, price, category, stock, image, description],
    (err, result) => {
      if (err) {
        console.error("Error adding product:", err);
        return res.status(500).json({ message: "Failed to add product" });
      }

      res.json({ message: "Product Added Successfully" });
    }
  );
};


// ==========================
// UPDATE PRODUCT
// ==========================

exports.updateProduct = (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const id = req.params.id;
  const { name, price, category, stock, description } = req.body;
  let image = "";

  if (req.file) {
    image = req.file.filename;
  }

  db.query(
    "SELECT image FROM products WHERE id=?",
    [id],
    (err, result) => {
      if (err) {
        console.error("Error finding product:", err);
        return res.status(500).json({ message: "Failed to update product" });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (!image) {
        image = result[0].image;
      }

      db.query(
        "UPDATE products SET name=?, price=?, category=?, stock=?, image=?, description=? WHERE id=?",
        [name, price, category, stock, image, description, id],
        (err, result) => {
          if (err) {
            console.error("Error updating product:", err);
            return res.status(500).json({ message: "Failed to update product" });
          }

          res.json({ message: "Product Updated Successfully" });
        }
      );
    }
  );
};


// ==========================
// DELETE PRODUCT
// ==========================
exports.deleteProduct = (req, res) => {
  const id = req.params.id;

  db.query(
    "SELECT image FROM products WHERE id=?",
    [id],
    (err, result) => {
      if (err) {
        console.error("Error finding product:", err);
        return res.status(500).json({ message: "Failed to delete product" });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "Product not found" });
      }

      const image = result[0].image;

      db.query(
        "DELETE FROM products WHERE id=?",
        [id],
        (err) => {
          if (err) {
            console.error("Error deleting product:", err);
            return res.status(500).json({ message: "Failed to delete product" });
          }

          if (image) {
            const imagePath = path.join(__dirname, "../uploads", image);
            fs.unlink(imagePath, (err) => {
              if (err) {
                console.log("Image not deleted:", err.message);
              }
            });
          }

          res.json({ message: "Product Deleted Successfully" });
        }
      );
    }
  );
};