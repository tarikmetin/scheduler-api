// Import mongoose
const mongoose = require("mongoose");
// Import bcrypt
const bcrypt = require("bcrypt");
// Import validator
const validator = require("validator");

// Make a schema
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Static signup method
userSchema.statics.signup = async function (email, password) {
  // validation // validator library is used here
  if (!email || !password) {
    throw Error("Please fill the empty fields");
  }
  if (!validator.isEmail(email)) {
    throw Error("Please use a valid email address");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error("Please use stronger password ");
  }

  //"this" here refers to the User document in the db
  const exists = await this.findOne({ email });

  if (exists) {
    throw Error("Email already taken");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ email, password: hash });

  // Function is going to be called elsewhere so we need to return user
  return user;
};

// Static login method
userSchema.statics.login = async function (email, password) {
  // validation // validator library is used here
  if (!email || !password) {
    throw Error("Please fill the empty fields");
  }

  //"this" here refers to the "User" document in the db
  const user = await this.findOne({ email });

  if (!user) {
    throw Error("Incorrect email");
  }

  //Compares the hashed password with the password in the db
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error("Incorrect password");
  }

  // Function is going to be called elsewhere so we need to return user
  return user;
};

// Make a modal and export
module.exports = mongoose.model("User", userSchema);
