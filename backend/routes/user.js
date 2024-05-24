const express = require("express");

const {
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
    bookmark,
    getBookmark,
    deleteBookmark,
    checkBookmark,
    getMyPost,
    follow,
    unfollow,
    uploadProfile,
    getUser,
    search,
    followercount,
    followingcount,
    checkfollowing,
    fetchfollowing
} = require("../controllers/user")

const router = express.Router();

// route register
router.post("/register", register);

// route login
router.post("/login", login);

// route logout
router.get("/logout", logout);

// route get user data
router.get("/user/:userId", getUser);

// route forgot password
router.post("/forgotpassword", forgotPassword)

// route reset password
router.post("/resetpassword", resetPassword)

// route add a post into bookmark
router.post("/bookmark", bookmark)

// route get all bookmarks of a user
router.get("/bookmark/:id", getBookmark)

// route delete a post from bookmark
router.delete("/bookmark", deleteBookmark)

// route check post exist in bookmark
router.post("/checkbookmark", checkBookmark)

// route get all posts of a user
router.get("/user/:id/post", getMyPost)

// route follow a user
router.post("/follow", follow)

// route unfollow a user
router.post("/unfollow", unfollow)

// route upload profile user
router.post("/profile", uploadProfile)

// route search
router.get("/search", search);

router.post("/countfollower", followercount);
router.post("/countfollowing", followingcount);

router.post("/checkfollow", checkfollowing);

router.post("/fetchfollowing", fetchfollowing);

module.exports = router;