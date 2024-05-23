const express = require("express");

const {newPost, postComment, getPosts} = require("../controllers/post");

const router = express.Router();

// route create a post
router.post("/post", newPost);

// route get post data
router.get("/posts", getPosts)

// route comment a post
router.post("/postcomment", postComment);

module.exports = router;
