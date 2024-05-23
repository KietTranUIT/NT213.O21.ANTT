const Post = require("../models/Post");
const User = require("../models/User");

exports.newPost = async (req, res) => {
  try {
    const newPost = await new Post(req.body).save();
    const data = await User.findById(req.body.user)
    await newPost.populate("user", "name picture");
    data.posts.push(newPost._id)
    data.save();
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

exports.getPosts = async (req, res) => {
    try {
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
  
      const skip = (page - 1) * size;
  
      const total = await Post.countDocuments();
      const posts = await Post.find().skip(skip).limit(size);
      await Promise.all(
        posts.map((post) => post.populate("user", "name picture about"))
      );
  
      res.status(201).send({
        posts,
        total,
        page,
        size,
      });
    } catch (error) {
      // console.log(error);
      res.status(400).json(error);
    }
};

exports.getPostData = async (req, res) => {
    try {
      const { id } = req.body;
      var data = await Post.findById(id);
      // console.log(data.user);
      //const datau = await User.findById(data.user)
  
      return res.status(200).json({ msg: data})
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: "error" });
    }
}

exports.getComment = async (req, res) => {
    try {
      const { id } = req.body;
      const data = await Post.findOne({ user: id });
      const user = data.comments
      res.status(201).json(user);
    } catch (error) {
      // console.log(error)
      res.status(400).json({ msg: "error" })
    }
}

exports.deletePost = async (req, res) => {
    try {
      const { postid, userid } = req.body;
      await Post.deleteOne({ _id: postid });
      var datas = await User.findById(userid);
      arr = datas.posts;
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] == postid) {
          arr.splice(i, 1);
        }
      }
      datas.posts = arr;
      datas.save();
      return res.status(200).json({ mgs: "ok" });
    } catch (error) {
      console.log(error);
      console.log("error in deleting post");
      return res.status(400).json({ mgs: "Error" });
    }
  }