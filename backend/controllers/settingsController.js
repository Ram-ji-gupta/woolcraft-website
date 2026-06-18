const db = require("../config/db");


// GET SETTINGS

exports.getSettings = (req,res)=>{

db.query(

"SELECT * FROM settings LIMIT 1",

(err,result)=>{

if(err){

return res.status(500).json(err);

}

res.json(result[0]);

}

);

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