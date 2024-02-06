const express = require('express');
const { registerUser, loginUser, currentUser,CreateProfile,EditProfile,updatePassword } = require('../controllers/userController');
const router = express.Router();
const validateToken = require('../middleware/validateTokenHandler')

router.post("/register",registerUser)
router.get("/login",loginUser)
router.get("/current", validateToken, currentUser)
router.put('/CreateProfile',validateToken,CreateProfile)
router.put('/EditProfile',validateToken,EditProfile)
router.put('/updatePassword',validateToken,updatePassword)

module.exports = router 