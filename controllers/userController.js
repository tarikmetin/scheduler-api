const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  // Creates a token and returns it
  return jwt.sign({ _id }, process.env.Secret, { expiresIn: "3d" });
};

//Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    //"login" method is a static method we create in the userModel.js
    const user = await User.login(email, password);

    //Create a token
    const token = createToken(user._id);

    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//Signup user
const signupUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    //"signup" method is a static method we create in the userModel.js
    const user = await User.signup(email, password);

    //Create a token
    const token = createToken(user._id);

    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { loginUser, signupUser };
