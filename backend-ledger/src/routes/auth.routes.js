const express = require('express')
const authController = require('../controllers/auth.controller.js')
const { authMiddleware } = require('../middleware/auth.middleware.js')


const router = express.Router()

// POST /api/auth/register
router.post('/register', authController.userRegisterController)


//POST /api/auth/login
router.post('/login', authController.userLoginController)

// POST /api/auth/logout
router.post('/logout', authMiddleware, authController.userLogoutController)

// GET /api/auth()
router.get('/', authMiddleware, authController.userGetController)

module.exports = router