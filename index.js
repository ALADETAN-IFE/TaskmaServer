const express = require("express");
require("dotenv").config();
require("./config/mongooseConfig");

const routes = require("./router/routes");
const port = process.env.PORT || 3000
const app = express();
const cors = require("cors")

app.use(express.json())
const corsOptions = {
    origin: '*', // Allow all origins
};
app.use(cors(corsOptions));
app.use('/api/v1/user', routes)

app.listen(port, ()=> {
    console.log(`server is running on port: ${port}`)
})

// npm start

// git init
// git add .
// git commit -m "first commit"
// git branch -M main
// git remote add origin https://github.com/ALADETAN-IFE/TaskmaServer.git
// git push -u origin main
