const bcrypt = require(`bcrypt`);
const jwt = require("jsonwebtoken");
require("dotenv").config();
const userModel = require("../models/userModels");
const taskModel = require("../models/taskModel");


const welcome = async (req, res) => {
   res.status(200).json({ message: "welcome to taskma app server" })
}

const signUp = async (req, res) => {
    const data = {
        email: req.body.email,
        password: req.body.password
    }

    try {
        const existingUser = await userModel.findOne({ email: data.email })
        if (existingUser) {
            res.status(400).json({ message: "user already exists" });
        } else {
            const saltRounds = 10;
            const gensalt = await bcrypt.genSalt(saltRounds)
            const hashPassword = await bcrypt.hash(data.password, gensalt)

            const user = new userModel({
                email: data.email,
                password: hashPassword
            });

            await user.save();

            res.status(201).json({ message: "successfully signed up", data: user })
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message })
    }
}
const login = async (req, res) => {
    const data = {
        email: req.body.email,
        password: req.body.password
    }

    try {
        const existingUser = await userModel.findOne({ email: data.email })
        if (existingUser) {
            const isPasswordMatch = await bcrypt.compare(data.password, existingUser.password);
            if (isPasswordMatch) {
                const token = jwt.sign({ id: existingUser._id, email: existingUser.email },
                    process.env.JWT_SECRET, { expiresIn: '7d' });

                await existingUser.save();

                res.status(200).json({ message: `login successfully`, data: existingUser, token: token })
            } else {
                res.status(400).json({ message: "incorrect password" });
            }
        } else {
            res.status(400).json({ message: "user not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message })
    }
}

const addTask = async (req, res) => {
    try {
     // Validate authenticated user
     if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Unauthorized: User not authenticated" });
    }
    const validUser = req.user;

    // Find the user by ID
    const user = await userModel.findById(validUser.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const { task, description, date, time, taskPriority, taskCategory } = req.body;

        // Validate required fields
        if (!task || !description || !date || !time || !taskPriority) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // if (!taskCategory) {
        //     taskCategory = {
        //         text: "Home",
        //         icon: "https://res.cloudinary.com/dserpv6p5/image/upload/v1732094144/Home_gchhds.png"
        //     }
        // }

        const newTask = new taskModel({
            task,
            description,
            // date: new Date(date), 
            // time: new Date(time), 
            date,
            time,
            taskPriority,
            taskCategory,
        });

        const savedTask = await newTask.save();

        // Add the task to the user's tasks array
        user.tasks.push(savedTask._id);
        const userDetails= await user.save();

        return res.status(201).json({
            message: "Task added successfully",
            data: savedTask,
            user: userDetails
        });
    } catch (error) {
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
        }
        res.status(500).json({ message: "Internal server error", error: error.message })
    }
};

const getUser = async (req, res) => {
    const user = await userModel.findById(req.params.userId);
    try {
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }else{
            return res.status(200).json({data: user});
        }

    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message })
    }
}

// const getAllTask = async (req, res) => {
//     const user = await userModel.findById(req.params.userId);
//     try {
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }else{
//             return res.status(200).json({message: `${user.tasks.length} tasks retrived successfully`, data: user});
//         }

//     } catch (error) {
//         res.status(500).json({ message: "Internal server error", error: error.message })
//     }
// }

const getAllTask = async (req, res) => {
    try {
        // Find the user by userId
        const user = await userModel.findById(req.params.userId).populate('tasks'); // Populate tasks

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: `${user.tasks.length} tasks retrieved successfully`,
            data: user.tasks, // Return the populated task array
        });

    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


const getTask = async (req, res) => {
    const tasks = await taskModel.findById(req.params.taskId);
    // console.log(req.params.taskId)
    // console.log(tasks)
    try {
        if (!tasks) {
            return res.status(404).json({ message: "task not found" });
        }else{ 
            return res.status(201).json({message: "task retrived successfully", data: tasks});
        }

    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message })
    }
}

module.exports = { welcome, 
    signUp, login, addTask, 
    getUser, getAllTask, getTask }