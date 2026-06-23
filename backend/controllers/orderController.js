const db = require("../config/db");
const path = require("path");
const { sendMail } = require("../utils/notify");

// ==========================
// GET ALL ORDERS
// ==========================

exports.getOrders = (req, res) => {
  db.query("SELECT * FROM orders ORDER BY id DESC", (err, result) => {
    if (err) {
      console.error("Error fetching orders from DB, falling back to JSON:", err);
      try {
        const fallbackPath = path.join(__dirname, "../db.json");
        const fallback = require(fallbackPath);
        return res.json(fallback.orders || []);
      } catch (e) {
        console.error("Fallback failed:", e);
        return res.status(500).json({ message: "Failed to fetch orders" });
      }
    }

    if (Array.isArray(result) && result.length > 0) {
      return res.json(result);
    }

    try {
      const fallbackPath = path.join(__dirname, "../db.json");
      const fallback = require(fallbackPath);
      return res.json(fallback.orders || []);
    } catch (e) {
      return res.json([]);
    }
  });
};

// ==========================
// CREATE ORDER
// ==========================

exports.createOrder = (req, res) => {
  const { customer, phone, email, address, customRequirement, items } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  let total = 0;
  items.forEach((item) => {
    total += Number(item.price) * Number(item.qty);
  });

  db.query(
    `
INSERT INTO orders
(
customer,
phone,
email,
address,
custom_requirement,
total,
status
)
VALUES
(?,?,?,?,?,?,?)
`,
    [customer, phone, email, address, customRequirement, total, "Pending"],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      const orderId = result.insertId;
      const status = "Pending";

      // SAVE ITEMS
      items.forEach((item) => {
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
          [orderId, item.id, item.qty, item.price]
        );
      });

      // SAVE CUSTOMER
      db.query("SELECT * FROM customers WHERE phone=?", [phone], (err2, rows) => {
        if (err2) {
          console.log(err2);
          // still return success of order creation
          return;
        }

        if (rows.length === 0) {
          db.query(
            `
INSERT INTO customers
(
name,
phone,
email,
address
)
VALUES
(?,?,?,?)
`,
            [customer, phone, email, address]
          );
        }

        // Fetch detailed item info (name + description) so WhatsApp/email can include it
        const ids = items.map((i) => Number(i.id)).filter((n) => Number.isFinite(n));
        if (ids.length === 0) {
          return res.json({ message: "Order Placed Successfully", orderId, status, itemsDetailed: [] });
        }

        const placeholders = ids.map(() => "?").join(",");
        db.query(
          `SELECT id, name, description FROM products WHERE id IN (${placeholders})`,
          ids,
          (err3, productRows) => {
            if (err3) {
              console.log(err3);
              // still return without description
              return res.json({
                message: "Order Placed Successfully",
                orderId,
                status,
                itemsDetailed: []
              });
            }

            const productMap = new Map((productRows || []).map((p) => [Number(p.id), p]));

            const itemsDetailed = items.map((it) => {
              const p = productMap.get(Number(it.id));
              return {
                productId: Number(it.id),
                name: p?.name || "Unknown Product",
                description: p?.description || "",
                qty: Number(it.qty),
                price: Number(it.price)
              };
            });

            const itemsText = itemsDetailed.length
              ? itemsDetailed
                  .map((it) => {
                    const price = Number(it.price || 0).toFixed(0);
                    const desc = it.description ? `\n   Description: ${it.description}` : "";
                    return `${it.name || "Item"} (Qty: ${it.qty || 0}) - ₹${price}${desc}`;
                  })
                  .join("\n\n")
              : "";

            const subject = `New Order Placed (ID: ${orderId})`;
            const html = `
              <p><b>New order placed</b></p>
              <ul>
                <li><b>Order ID:</b> ${orderId}</li>
                <li><b>Status:</b> ${status}</li>
                <li><b>Customer Name:</b> ${customer}</li>
                <li><b>Phone:</b> ${phone}</li>
                <li><b>Email:</b> ${email || ""}</li>
                <li><b>Address:</b> ${address}</li>
              </ul>
              <p><b>Items:</b></p>
              <pre style="white-space:pre-wrap; font-family: Arial, sans-serif">${itemsText}</pre>
            `;

            const emailText = `New order placed\nOrder ID: ${orderId}\nStatus: ${status}\nCustomer: ${customer}\nPhone: ${phone}\nEmail: ${email || ""}\nAddress: ${address}\n\nItems:\n${itemsText}`;

            // Send email notification (non-blocking for response)
            sendMail({
              subject,
              html,
              text: emailText
            }).catch((e) => {
              console.error("Order email failed:", e);
            });

            return res.json({
              message: "Order Placed Successfully",
              orderId,
              status,
              itemsDetailed
            });
          }
        );
      });
    }
  );
};

// ==========================
// UPDATE STATUS
// ==========================

exports.updateOrderStatus = (req, res) => {
  const id = req.params.id;
  const status = req.body.status;

  db.query("UPDATE orders SET status=? WHERE id=?", [status, id], (err) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json({ message: "Status Updated" });
  });
};

