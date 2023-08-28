const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    lowercase: true,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  isDeleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
