const express = require('express')
const router = express.Router();
const {registerUser, loginUser} = require('../controllers/auth.controller')

// Register routes
router
.route('/register')
.post(registerUser)

// Login  routes
router
.route('/login')
.post(loginUser)

module.exports = router