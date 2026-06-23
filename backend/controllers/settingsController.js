const db = require("../config/db");
const path = require("path");

// GET SETTINGS
exports.getSettings = (req, res) => {
  db.query("SELECT * FROM settings LIMIT 1", (err, result) => {
    if (err) {
      console.error("Error fetching settings from DB, falling back to JSON:", err);
      try {
        const fallbackPath = path.join(__dirname, "../db.json");
        const fallback = require(fallbackPath);
        return res.json(fallback.settings);
      } catch (e) {
        console.error("Fallback failed:", e);
        return res.status(500).json({ message: "Failed to fetch settings" });
      }
    }

    if (result && result.length > 0) {
      return res.json(result[0]);
    }

    try {
      const fallbackPath = path.join(__dirname, "../db.json");
      const fallback = require(fallbackPath);
      return res.json(fallback.settings);
    } catch (e) {
      return res.status(500).json({ message: "Failed to fetch settings" });
    }
  });
};


// UPDATE SETTINGS

exports.updateSettings = (req,res)=>{

const {

store_name,
phone,
email,
address,
admin_username,
admin_password

} = req.body;


db.query(

`
UPDATE settings

SET

store_name=?,
phone=?,
email=?,
address=?,
admin_username=?,
admin_password=?

WHERE id=1
`,

[
store_name,
phone,
email,
address,
admin_username,
admin_password
],

(err,result)=>{

if(err){

return res.status(500).json(err);

}

res.json({

message:"Settings Updated"

});

}

);

};