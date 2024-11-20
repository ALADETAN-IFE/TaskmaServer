const bcrypt = require(`bcrypt`);
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModels");


const signUp = async (req, res) => {
    // const data = {
    //     email: req.body.email,
    //     password: req.body.password
    // }

    try {
        const existingUser = await userModel.findOne({ email: req.body.email })
        if (existingUser) {
            res.status(400).json({ message: "user already exists" });
        } else {
            const saltRounds = 10;
            const gensalt = await bcrypt.genSalt(saltRounds)
            const hashPassword = await bcrypt.hash(req.body.password, gensalt)

            const user = { email: req.body.email, password: hashPassword }

            await userModel.save();

            res.status(201).json({ message: "successfully signed up", data: user })
        }
    } catch (error) {
        res.status(500).json(err.message)
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

                res.status(200).json({message:`login successfully`, data: existingUser, token: token})
            } else {
                res.status(400).json({message:"incorrect password"});
            }
        } else {
            res.status(400).json({message:"user not found"});
        }
    } catch (error) {
        res.status(500).json(err.message)
    }
}

module.exports = { signUp, login, }