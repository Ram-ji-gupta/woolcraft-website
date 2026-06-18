const express = require("express");
const router = express.Router();

const {
  getOrders,
  createOrder,
  updateOrderStatus
} = require("../controllers/orderController");

// GET all orders
router.get("/", getOrders);

// CREATE a new order
router.post("/", createOrder);

// UPDATE order status
router.put("/:id", updateOrderStatus);

module.exports = router;
