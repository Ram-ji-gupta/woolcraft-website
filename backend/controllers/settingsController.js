const { readDB, writeDB } = require("../config/db-helper");

// GET SETTINGS
exports.getSettings = (req, res) => {
  const data = readDB();
  res.json(data.settings);
};

// UPDATE SETTINGS
exports.updateSettings = (req, res) => {
  const data = readDB();
  data.settings = {
    ...data.settings,
    ...req.body
  };

  writeDB(data);
  res.json({ message: "Settings Updated" });
};
