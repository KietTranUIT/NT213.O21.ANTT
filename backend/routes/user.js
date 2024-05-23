const express = require("express");

const {
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
    bookmark,
    getBookmark,
    deleteBookmark
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

// route add a post into bookmark
router.post("/bookmark", bookmark)

// route get all bookmarks of a user
router.get("/bookmark", getBookmark)

// route delete a post from bookmark
router.delete("/bookmark", deleteBookmark)

module.exports = router;