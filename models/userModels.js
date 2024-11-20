const mongoose = require("mongoose");
const taskModel = require("./taskModel")
const categories = require("./categories")

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    tasks: {
        type: Object,
        default: [taskModel]
    },
    categories: {
        type: Object,
        default: categories
    }

},{timestamps:true})

const userModel =  mongoose.model("users", userSchema)

module.exports = userModel
