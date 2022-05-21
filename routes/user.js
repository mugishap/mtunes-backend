const express = require('express')
const {  checkForAccess } = require('../middlewares/auth')
const { registerUser, login, getDetails, logout } = require('./../controllers/user')

const userRouter = express.Router()

userRouter.post('/newAccount', registerUser)
userRouter.post('/login',login)
userRouter.get('/logout',checkForAccess,logout)

module.exports = userRouter