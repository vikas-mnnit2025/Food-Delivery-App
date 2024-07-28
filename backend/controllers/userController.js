import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "user doesn't exist" });
    }

    // user exist then matching password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.json({ success: false, message: "Invalid credentials" });
    }

    // if password match then create token and send as res
    const token = createToken(user.id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "error in loginctrl" });
  }
};

// generate a token and send it
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// register user
const registerUser = async (req, res) => {
  // destructiong data
  const { name, password, email } = req.body;
  try {
    // checking user existance
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "user already exist" });
    }

    // validate email format and strong password
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "pleae enter valid email" });
    }

    // checking password length is greater than eight digit
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "please enter a strong password",
      });
    }
    // hashing user password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new userModel({
      name: name,
      email: email,
      password: hashedPassword,
    });

    // saving user in data base
    const user = await newUser.save();
    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "error in register" });
  }
};

export { loginUser, registerUser };
