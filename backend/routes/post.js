const express = require("express");

const {newPost, postComment} = require("../controllers/post");

const router = express.Router();

// route create a post
router.post("/post", newPost);

// route comment a post
router.post("/postcomment", postComment);

module.exports = router;
