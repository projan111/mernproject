const mongoose = require("mongoose");
const bycript = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  gender: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  age: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmpassword: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});
//Generating Tokens For Registration
userSchema.methods.generateAuthToken = async function () {
  try {
    const token = jwt.sign(
      { _id: this._id.toString() },
      process.env.SECRET_KEY
    );
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (error) {
    res.send("This is an error part" + error);
  }
};

// Generating password into hash code
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bycript.hash(this.password, 10);
    this.confirmpassword = await bycript.hash(this.confirmpassword, 10);
    next();
  }
});

const Register = new mongoose.model("Register", userSchema);

module.exports = Register;
