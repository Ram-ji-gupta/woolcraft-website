const db = require("../config/db");
const path = require("path");

// GET CUSTOMERS
exports.getCustomers = (req, res) => {
  db.query("SELECT * FROM customers", (err, result) => {
    if (err) {
      console.error("Error fetching customers from DB, falling back to JSON:", err);
      try {
        const fallbackPath = path.join(__dirname, "../db.json");
        const fallback = require(fallbackPath);
        return res.json(fallback.customers || []);
      } catch (e) {
        console.error("Fallback failed:", e);
        return res.status(500).json({ message: "Failed to fetch customers" });
      }
    }

    if (Array.isArray(result) && result.length > 0) {
      return res.json(result);
    }

    try {
      const fallbackPath = path.join(__dirname, "../db.json");
      const fallback = require(fallbackPath);
      return res.json(fallback.customers || []);
    } catch (e) {
      return res.json([]);
    }
  });
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