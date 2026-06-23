const express =
require("express");

const router =
express.Router();

const {
  getSettings,
  updateSettings
} = require("../controllers/settingsController");

const requireAdmin = require("../middleware/requireAdmin");
const sanitizeSettings = require("../middleware/sanitizeSettings");

router.get("/", (req, res, next) => {
  // only admin can read settings; response will not include admin_password
  requireAdmin(req, res, () => getSettings(req, {
    json: (row) => res.json(sanitizeSettings(row))
  }));
});

router.put("/", requireAdmin, updateSettings);

module.exports = router;
