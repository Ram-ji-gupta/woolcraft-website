const db = require("../config/db");
const fs = require("fs");
const path = require("path");

// ==========================
// GET ALL PRODUCTS
// ==========================

exports.getProducts = (req,res)=>{

db.query(

"SELECT * FROM products ORDER BY id DESC",

(err,result)=>{

if(err){

return res.status(500)
.json(err);

}

res.json(result);

}

);

};


// ==========================
// GET PRODUCT BY ID
// ==========================

exports.getProductById = (req,res)=>{

const id =
req.params.id;

db.query(

"SELECT * FROM products WHERE id=?",

[id],

(err,result)=>{

if(err){

return res.status(500)
.json(err);

}

if(result.length===0){

return res.status(404)
.json({

message:
"Product not found"

});

}

res.json(result[0]);

}

);

};


// ==========================
// ADD PRODUCT
// ==========================

exports.addProduct = (req,res)=>{

const {

name,
price,
category,
stock,
description

}
=
req.body;

const image =
req.file
?
req.file.filename
:
"";

db.query(

`
INSERT INTO products
(
name,
price,
category,
stock,
image,
description
)

VALUES
(?,?,?,?,?,?)
`,

[
name,
price,
category,
stock,
image,
description
],

(err,result)=>{

if(err){

return res.status(500)
.json(err);

}

res.json({

message:
"Product Added Successfully"

});

}

);

};


// ==========================
// UPDATE PRODUCT
// ==========================

exports.updateProduct = (req,res)=>{

const id =
req.params.id;

const {

name,
price,
category,
stock,
description

}
=
req.body;

let image = "";


if(req.file){

image =
req.file.filename;

}


db.query(

"SELECT image FROM products WHERE id=?",

[id],

(err,result)=>{

if(err){

return res.status(500)
.json(err);

}

if(result.length===0){

return res.status(404)
.json({

message:
"Product not found"

});

}


if(!image){

image =
result[0].image;

}


db.query(

`
UPDATE products

SET

name=?,
price=?,
category=?,
stock=?,
image=?,
description=?

WHERE id=?
`,

[
name,
price,
category,
stock,
image,
description,
id
],

(err,result)=>{

if(err){

return res.status(500)
.json(err);

}

res.json({

message:
"Product Updated Successfully"

});

}

);

}

);

};


// ==========================
// DELETE PRODUCT
// ==========================
exports.deleteProduct = (req,res)=>{

const id =
req.params.id;


db.query(

"SELECT image FROM products WHERE id=?",

[id],

(err,result)=>{

if(err){

return res.status(500)
.json(err);

}


if(result.length===0){

return res.status(404)
.json({

message:
"Product not found"

});

}


const image =
result[0].image;


db.query(

"DELETE FROM products WHERE id=?",

[id],

(err)=>{

if(err){

return res.status(500)
.json(err);

}


if(image){

const imagePath =
path.join(
__dirname,
"../uploads",
image
);


fs.unlink(

imagePath,

(err)=>{

if(err){

console.log(
"Image not deleted:",
err.message
);

}

}

);

}


res.json({

message:
"Product Deleted Successfully"

});

}

);

}

);

};