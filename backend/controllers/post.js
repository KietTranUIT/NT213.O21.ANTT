const Post = require("../models/Post");
const User = require("../models/User");

exports.newPost = async (req, res) => {
  try {
    const newPost = await new Post(req.body).save();
    await newPost.populate("user", "name picture");
    res.json(newPost);
  } catch (error) {
    // console.log(error)
    return res.status(500).json({ message: error.message });
  }
};