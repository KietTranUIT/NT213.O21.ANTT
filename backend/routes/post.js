const express = require("express");

const {newPost} = require("../controllers/post");

const router = express.Router();

// route create a post
router.post("/post", newPost);

module.exports = router;
