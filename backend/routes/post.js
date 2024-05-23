const express = require("express");

const {newPost, postComment, getPosts, getPostData} = require("../controllers/post");

const router = express.Router();

// route create a post
router.post("/post", newPost);

// route get all posts
router.get("/posts", getPosts)

// route get a post data
router.get("/post", getPostData)

// route comment a post
router.post("/postcomment", postComment);

module.exports = router;
