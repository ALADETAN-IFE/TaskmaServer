const express = require("express")
const {signUp, login, } = require("../controllers/controls")

const routes = express.Router()

routes.post(`/signup`, signUp)
routes.post(`/signin`, login)

module.exports = routes