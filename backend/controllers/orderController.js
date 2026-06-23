const { readDB, writeDB } = require("../config/db-helper");
const { sendMail } = require("../utils/notify");

// ==========================
// GET ALL ORDERS
// ==========================
exports.getOrders = (req, res) => {
  const data = readDB();
  res.json(data.orders);
};

// ==========================
// CREATE ORDER
// ==========================
exports.createOrder = (req, res) => {
  const { customer, phone, email, address, custom_requirement, items } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  let total = 0;
  items.forEach(item => total += Number(item.price) * Number(item.qty));

  const data = readDB();
  const newId = data.orders.length > 0 ? Math.max(...data.orders.map(o => o.id)) + 1 : 1;

  const newOrder = {
    id: newId,
    customer,
    phone,
    email: email || null,
    address,
    custom_requirement: custom_requirement || null,
    status: "Pending",
    created_at: new Date().toISOString(),
    total: total.toFixed(2)
  };

  data.orders.push(newOrder);
  writeDB(data);

  res.json({
    message: "Order Placed Successfully",
    orderId: newId,
    status: "Pending",
    itemsDetailed: items
  });
};

// ==========================
// UPDATE STATUS
// ==========================
exports.updateOrderStatus = (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body;
  const data = readDB();
  const orderIndex = data.orders.findIndex(o => o.id === id);

  if (orderIndex === -1) {
    return res.status(404).json({ message: "Order not found" });
  }

  data.orders[orderIndex].status = status;
  writeDB(data);

  res.json({ message: "Status Updated" });
};
