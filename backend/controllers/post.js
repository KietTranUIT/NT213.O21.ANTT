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

exports.postComment = async (req, res) => {
    try {
      const { name,
        image,
        content,
        id1,
        id2 } = req.body;
      const user = await Post.findOne({ user: id2 });
      // var n = user.comment.size();
      const date = new Date();
  
      var ndata = {
        comment: content,
        image: image,
        commentBy: id1,
        commentAt: date,
        name: name
      }
      var datas = user.comments;
      datas.push(ndata)
      user.comments = datas;
      user.save();
      res.status(201).json({ msg: "ok" });
    } catch (error) {
      // console.log(error)
      res.status(401).json({ msg: "An Error Occurred" })
    }
  }