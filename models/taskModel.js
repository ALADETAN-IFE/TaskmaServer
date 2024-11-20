const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    date: {
        type: Date,
        required: true,
        trim: true,
    },
    time: {
        type: Date,
        required: true,
        trim: true,
    },
    taskPriority: {
        type: String,
        required: true,
        enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    },
    taskCategory: {
        type: Object,
        default:{
            text: "Home",
            icon: "https://res.cloudinary.com/dserpv6p5/image/upload/v1732094144/Home_gchhds.png"
        }
    },
    completed:{
        type: String,
        required: true,
        default: false
    }

},{timestamps:true})

const taskModel =  mongoose.model("tasks", taskSchema)

module.exports = taskModel
