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
        // type: Date,
        type: String,
        required: true,
        trim: true,
    },
    time: {
        // type: Date,
        type: String,
        required: true,
        trim: true,
    },
    taskPriority: {
        type: Number,
        required: true,
        enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    },
    taskCategory: {
        type: Object,
        default: {
            text: "Home",
            icon: "https://res.cloudinary.com/dserpv6p5/image/upload/v1732094144/Home_gchhds.png"
        }
    },
    completed: {
        type: String,
        required: true,
        default: false
    }

}, { timestamps: true })

// // Virtual to format date
// taskSchema.virtual("formattedDate").get(function () {
//     return this.date.toISOString().split("T")[0];
// });

// // Include virtuals in JSON response
// taskSchema.set("toJSON", { virtuals: true });

const taskModel = mongoose.model("tasks", taskSchema)

module.exports = taskModel
