const express = require("express");

const {newPost, postComment, getPosts, getPostData, getComment, deletePost} = require("../controllers/post");

const router = express.Router();

// route create a post
router.post("/post", newPost);

// route get all posts
router.get("/posts", getPosts)

// route get a post data
router.get("/post/:id", getPostData)

// route get all comments of a post
router.get("/comment/:id", getComment)

// route comment a post
router.post("/postcomment", postComment);

// route delete a post
router.delete("/post", deletePost)

module.exports = router;
