const express = require("express");

const {
    register,
    login,
    logout,
    forgotpassword
} = require("../controllers/user")

const router = express.Router();

// route register
router.post("/register", register);

// route login
router.post("/login", login);

// route logout
router.get("/logout", logout);

router.post("/forgotpassword", forgotpassword)

module.exports = router;