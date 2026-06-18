const db = require("../config/db");


// ==========================
// GET ALL ORDERS
// ==========================

exports.getOrders = (req,res)=>{

db.query(

"SELECT * FROM orders ORDER BY id DESC",

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
// CREATE ORDER
// ==========================

exports.createOrder = (req,res)=>{

const {

customer,
phone,
address,
items

}
=
req.body;


if(!items || items.length===0){

return res.status(400)
.json({

message:
"Cart is empty"

});

}


let total = 0;

items.forEach(item=>{

total +=
Number(item.price) *
Number(item.qty);

});


db.query(

`
INSERT INTO orders
(
customer,
phone,
address,
total,
status
)

VALUES
(?,?,?,?,?)
`,

[
customer,
phone,
address,
total,
"Pending"
],

(err,result)=>{

if(err){

return res.status(500)
.json(err);

}


const orderId =
result.insertId;


// SAVE ITEMS

items.forEach(item=>{

db.query(

`
INSERT INTO order_items
(
order_id,
product_id,
quantity,
price
)

VALUES
(?,?,?,?)
`,

[
orderId,
item.id,
item.qty,
item.price
]

);

});


// SAVE CUSTOMER

db.query(

"SELECT * FROM customers WHERE phone=?",

[phone],

(err,rows)=>{

if(err){

console.log(err);

return;

}


if(rows.length===0){

db.query(

`
INSERT INTO customers
(
name,
phone,
address
)

VALUES
(?,?,?)
`,

[
customer,
phone,
address
]

);

}

}

);


res.json({

message:
"Order Placed Successfully"

});

}

);

};


// ==========================
// UPDATE STATUS
// ==========================

exports.updateOrderStatus = (req,res)=>{

const id =
req.params.id;

const status =
req.body.status;


db.query(

"UPDATE orders SET status=? WHERE id=?",

[
status,
id
],

(err,result)=>{

if(err){

return res.status(500)
.json(err);

}

res.json({

message:
"Status Updated"

});

}

);

};