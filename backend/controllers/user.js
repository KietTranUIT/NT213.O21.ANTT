const { validateEmail, validateLength } = require("../helper/validation");
const { generateToken } = require("../helper/token");
const generateCode = require("../helper/gencode")
const {sendResetCode} = require("../helper/mail")
const User = require("../models/User");
const Code = require("../models/Code");
const Post = require("../models/Post")
const bcrypt = require("bcrypt");


// hàm register xử lí các request đăng kí từ client
exports.register = async (req, res) => {
    try {
      const { name, email, password } = req.body;
      if (!validateLength(name, 6, 15)) {
        return res
        .status(400)
        .json({ message: "Enter name between 6 to 15 characters !" });
      }
      if (!validateEmail(email)) {
        return res.status(400).json({ message: "Please enter a valid email !" });
      }
      
      if (!validateLength(password, 6, 15)) {
        return res
        .status(400)
        .json({ message: "Enter password between 6 to 15 characters !" });
      }
      
      // kiểm tra xem email đăng kí đã tồn tại hay chưa
      const check = await User.findOne({ email });
      if (check) {
        return res.status(400).json({
          message:
          "This email already exists,try again with a different email",
        });
      }
      
      const hashed_password = await bcrypt.hash(password, 10);
      const user = await new User({
        name:name,
        email:email,
        password: hashed_password,
        verify: true
      }).save();
      const token = generateToken({ id: user._id.toString() }, "15d");
      res.send({
        id: user._id,
        name: user.name,
        picture: user.picture,
        token: token,
        message: "Register Success !",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
};

// hàm login xử lí các request đăng nhập từ phía client
exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email:email });
      if (!user) {
        return res.status(400).json({
          message:
            "the email you entered is not registered.",
        });
      }
      const check = await bcrypt.compare(password, user.password);
      if (!check) {
        return res.status(400).json({
          message: "Invalid Credentials. Please Try Again.",
        });
      }
      const token = generateToken({ id: user._id.toString() }, "15d");
      res.send({
        id: user._id,
        name: user.name,
        picture: user.picture,
        token: token,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

// Xử lí yêu cầu đăng xuất từ client
exports.logout = async(req, res) => {
    try {
        // req.logout((err) => {
        //   if (err) {
        //     return res.status(400).json("Couldn't logout");
        //   }
        // });
        res.cookie('session', '', { expires: new Date(0), });
        res.clearCookie("sessionId");
        res.status(200).json({ success: true });
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
}

// Xử lí yêu cầu quên mật khảu và gửi mã xác thực về mail client
exports.forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      await Code.findOneAndDelete({ user: user._id });
      const code = generateCode(5);
      const savedCode = await new Code({
        code,
        user: user._id,
      }).save();
      sendResetCode(user.email, user.name, code);
      return res.status(200).json({
        message: "Email reset code has been sent to your email",
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

// Xử lí reset mật khẩu cho client
exports.resetPassword = async (req, res) => {
    try {
      const { email, code, password } = req.body;
      const user = await User.findOne({ email });
      const Dbcode = await Code.findOne({ user: user._id });
      if (Dbcode.code !== code) {
        return res.status(400).json({
          message: "Verification code is wrong!",
        });
      }
      const hashed_password = await bcrypt.hash(password, 10);
      await User.findOneAndUpdate({password: hashed_password})
      await Code.findOneAndDelete({user: user._id})
      return res.status(200).json({ message: "ok" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

exports.bookmark = async (req, res) => {
    try {
      const {
        postid,
        userid
      } = req.body;
      const user = await User.findOne({ _id: userid });
      var m = user.bookmarks;
      var f = 0;
      if (m.length == 0) {
        user.bookmarks.push(postid);
      }
      else {
        for (var i = 0; i < m.length; i++) {
          if (m[i] == postid) {
            f = 1;
            m.splice(i, 1);
            m.push(postid);
            user.bookmarks = m;
            break;
          }
        }
      }
      if (f == 1) {
        user.save();
        return res.status(202).json({ msg: "exists" });
      }
      else {
        user.bookmarks.push(postid);
        user.save();
        return res.status(202).json({ msg: "ok" });
      }
    } catch (error) {
      console.log(error);
      return res.status(401).json({ msg: "ERROR" })
    }
};

exports.getBookmark = async (req, res) => {
    try {
      const { id } = req.body;
      const data = await User.findById(id)
      var arr = data.bookmarks;
      var respon = [];
      var img = "";
      var title = "";
      var desc = "";
      var imgp = "";
      var name = "";
      var userid = "";
      var postid = "";
      for (var i = 0; i < arr.length; i++) {
        var pd = await Post.findById(arr[i]);
        if (!pd) {
          arr.splice(i, 1);
          data.bookmarks = arr;
          data.save();
          continue;
        }
        img = pd.image;
        title = pd.title;
        desc = pd.description;
        userid = pd.user;
        var ud = await User.findById(userid);
        imgp = ud.picture;
        name = ud.name;
        postid = arr[i];
        respon.push({
          img: img,
          title: title,
          desc: desc,
          imgp: imgp,
          name: name,
          userid: userid,
          postid: postid
        })
      }
      return res.status(200).json({ msg: respon });

    } catch (error) {
      console.log(error)
      return res.status(400).json({ msg: "error" });
    }
};

exports.deleteBookmark = async (req, res) => {
    try {
      const {
        postid,
        userid
      } = req.body;
      const user = await User.findOne({ _id: userid });
      var m = user.bookmarks;
      var f = 0;
      if (m.length == 0) {
        return res.status(202).json({ msg: "Does not exists" });
      }
      else {
        for (var i = 0; i < m.length; i++) {
          if (m[i] == postid) {
            f = 1;
            m.splice(i, 1);
          }
        }
        user.bookmarks = m;
        user.save();
        if (f == 1) {
          return res.status(202).json({ msg: "deleted" });
        }
        else {
          return res.status(202).json({ msg: "not found" });
        }
  
      }
      // user.bookmarks.push(postid);
    }
    catch (error) {
      console.log(error);
      return res.status(401).json({ msg: "ERROR" })
    }
}

exports.checkBookmark = async (req, res) => {
    try {
      const {
        postid,
        userid
      } = req.body;
      const user = await User.findOne({ _id: userid });
      var m = user.bookmarks;
      if (m.length == 0) {
        return res.status(202).json({ msg: "Does not exist" });
      }
      else {
        for (var i = 0; i < m.length; i++) {
          if (m[i] == postid) {
            return res.status(202).json({ msg: "ok" });
          }
        }
        return res.status(202).json({ msg: "Does not exists" });
      }
      // user.bookmarks.push(postid);
    }
    catch (error) {
      console.log(error);
      return res.status(401).json({ msg: "ERROR" })
    }
};

exports.getMyPost = async (req, res) => {
    try {
      const { id } = req.body;
      const data = await User.findById(id)
  
      var arr = data.posts;
      var respon = [];
      var img = "";
      var title = "";
      var desc = "";
      var imgp = "";
      var name = "";
      var userid = "";
      var postid = "";
      // console.log(99,arr.length);
      for (var i = 0; i < arr.length; i++) {
        var pd = await Post.findById(arr[i]);
        if (!pd) {
          continue;
        }
        img = pd.image;
        title = pd.title;
        desc = pd.description;
        userid = pd.user;
        var ud = await User.findById(userid);
        imgp = ud.picture;
        name = ud.name;
        postid = arr[i];
        respon.push({
          img: img,
          title: title,
          desc: desc,
          imgp: imgp,
          name: name,
          userid: userid,
          postid: postid
        })
      }
      return res.status(200).json({ msg: respon });
    } catch (error) {
      return res.status(400).json({ msg: "error" });
    }
};

exports.follow = async (req, res) => {
    try {
      const { id, id2 } = req.body;
      const user = await User.findById(id);
      const user2 = await User.findById(id2);
  
      var mm = user2.followerscount;
      mm = mm + 1;
      user2.followerscount = mm;
      user2.save();

      var f = 0;
      var m = user.following;
      if (m.length == 0) {
        user.following.push(id2);
      }
      else {
        for (var i = 0; i < m.length; i++) {
          if (m[i] == id2) {
            f = 1;
            break;
          }
        }
        if (!f) {
          m.push(id2);
        }
  
        user.following = m;
      }
      user.followingcount = user.followingcount + 1;
      user.save();

      return res.status(200).json({ msg: "ok" });
    } catch (error) {
      console.log(error);
      console.log("error in follow");
      return res.status(400).json({ msg: "error in follow" });
    }
};

exports.unfollow = async (req, res) => {
    try {
      const { id, id2 } = req.body;
      const user = await User.findById(id);
      const user2 = await User.findById(id2);

      var mm = user2.followerscount
      if (mm - 1 < 0) {
        mm = 0;
      }
      else {
        mm = mm - 1;
      }
      user2.followerscount = mm;
      user2.save();

      var f = 0;
      var m = user.following;
      if (m.length == 0) {
        return res.status(200).json({ msg: "ok" });
        // user.following.push(id2);
      }
      else {
        for (var i = 0; i < m.length; i++) {
          if (m[i] == id2) {
            f = 1;
            m.splice(i, 1);
            break;
          }
        }
        user.following = m;
      }

      if (f == 1) {
        user.followingcount = user.followingcount - 1
      }
      user.save();
      res.status(200).json({ msg: "ok" });
    } catch (error) {
      console.log("error in unfollow");
      res.status(400).json({ msg: "error in unfollow" });
    }
};

exports.uploadProfile = async (req, res) => {
    try {
      const { picture, about } = req.body;
  
      await User.findByIdAndUpdate(req.body.id, {
        picture: picture,
        about: about,
      });
      res.status(200).json({ picture, about });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};