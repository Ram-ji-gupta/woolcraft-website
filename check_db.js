require('dotenv').config({ path: './backend/.env' });
const db = require('./backend/config/db');

db.query("SELECT * FROM settings", (err, result) => {
    if (err) {
        console.error('Error:', err);
    } else {
        console.log('Settings:', result);
    }
    db.end();
});
