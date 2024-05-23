const { validateEmail, validateLength } = require("../helper/validation");
const { generateToken } = require("../helper/token");
const User = require("../models/User");
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