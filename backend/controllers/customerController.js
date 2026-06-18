const db =
require("../config/db");

// GET CUSTOMERS
exports.getCustomers = (req,res)=>{
db.query(
"SELECT * FROM customers",
(err,result)=>{
if(err){
return res.status(500)
.json(err);
}
res.json(result);
}
);
};
// ADD CUSTOMER
exports.addCustomer = (req,res)=>{
const {
name,
phone,
email,
address
}
=
req.body;
const sql =
`
INSERT INTO customers
(name,phone,email,address)
VALUES (?,?,?,?)
`;
db.query(
sql,
[
name,
phone,
email,
address
],
(err,result)=>{
if(err){
return res.status(500)
.json(err);
}
res.json({
message:
"Customer Added"
});
}
);
};
// DELETE CUSTOMER
exports.deleteCustomer =
(req,res)=>{
const id =
req.params.id;
db.query(
"DELETE FROM customers WHERE id=?",
[id],
(err,result)=>{
if(err){
return res.status(500)
.json(err);
}
res.json({
message:
"Customer Deleted"
});
}
);
};