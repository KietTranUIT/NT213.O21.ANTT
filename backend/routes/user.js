const express = require("express");

const {
    register,
    login,
    logout,
    forgotPassword,
    resetPassword
} = require("../controllers/user")

const router = express.Router();

// route register
router.post("/register", register);

// route login
router.post("/login", login);

// route logout
router.get("/logout", logout);

// route forgot password
router.post("/forgotpassword", forgotPassword)

// route reset password
router.post("/resetpassword", resetPassword)

module.exports = router;