const { readDB, writeDB } = require("../config/db-helper");

// GET CUSTOMERS
exports.getCustomers = (req, res) => {
  const data = readDB();
  res.json(data.customers);
};

// ADD CUSTOMER
exports.addCustomer = (req, res) => {
  const { name, phone, email, address } = req.body;
  const data = readDB();
  const newId = data.customers.length > 0 ? Math.max(...data.customers.map(c => c.id)) + 1 : 1;

  const newCustomer = {
    id: newId,
    name,
    phone,
    email: email || null,
    address
  };

  data.customers.push(newCustomer);
  writeDB(data);

  res.json({ message: "Customer Added" });
};

// DELETE CUSTOMER
exports.deleteCustomer = (req, res) => {
  const id = Number(req.params.id);
  const data = readDB();
  const customerIndex = data.customers.findIndex(c => c.id === id);

  if (customerIndex === -1) {
    return res.status(404).json({ message: "Customer not found" });
  }

  data.customers.splice(customerIndex, 1);
  writeDB(data);

  res.json({ message: "Customer Deleted" });
};
