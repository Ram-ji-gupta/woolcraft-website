// update_admin_password.js
const db = require('./backend/config/db');
const newPassword = "admin@123"; // new admin password
// Update settings (assuming id=1)
const sql = `UPDATE settings SET admin_password = ? WHERE id = 1`;
 db.query(sql, [newPassword], (err, result) => {
   if (err) {
     console.error('Error updating admin password:', err);
   } else {
     console.log('Admin password updated successfully');
   }
   // Close connection
   db.end?.();
 });
