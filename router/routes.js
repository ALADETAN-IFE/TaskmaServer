const express = require("express")
const { welcome, 
    signUp, login, addTask, 
    getUser, getAllTask, getTask } = require("../controllers/controls")
const auth = require("../middleware/auth")

const routes = express.Router()

routes.post(`/signup`, signUp)
routes.post(`/signin`, login)
routes.post(`/add-task`, auth, addTask)
//routes.get(`/`, welcome)
routes.get(`/:userId`, getUser)
routes.get(`/tasks/:userId`, getAllTask)
routes.get(`/task/:taskId`, getTask)

module.exports = routes