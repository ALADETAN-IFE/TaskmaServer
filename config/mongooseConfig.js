const mongoose = require("mongoose");

require(`dotenv`).config()
const link = process.env.CONNECT_LINK
const connect = mongoose.connect(link);

//check database connected or not
connect.then(() => {
console. log("Database connected Successfully");
})

.catch((err) => {
console.log(`Database cannot be connected due to ${err} `);
})