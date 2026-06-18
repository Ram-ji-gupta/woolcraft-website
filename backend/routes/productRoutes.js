// backend/routes/productRoutes.js

const express = require("express");

const router = express.Router();

const upload =
require("../middleware/upload");

const {

getProducts,
getProductById,
addProduct,
updateProduct,
deleteProduct

}
=
require(
"../controllers/productController"
);


// ==========================
// GET ALL PRODUCTS
// ==========================

router.get(

"/",

getProducts

);


// ==========================
// GET SINGLE PRODUCT
// ==========================

router.get(

"/:id",

getProductById

);


// ==========================
// ADD PRODUCT
// ==========================

router.post(

"/",

upload.single(
"image"
),

addProduct

);


// ==========================
// UPDATE PRODUCT
// ==========================

router.put(

"/:id",

upload.single(
"image"
),

updateProduct

);


// ==========================
// DELETE PRODUCT
// ==========================

router.delete(

"/:id",

deleteProduct

);


module.exports =
router;