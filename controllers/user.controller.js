const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  console.log("Inside registerUser API");
  try {
    const { username, email, password } = req.body;

    const exist = await User.findOne({ email: email, isDeleted: false });
    if (exist) return res.status(400).send("User Already Exists!");

    const user = new User({
      username,
      email,
    });
    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);
    user.password = hashPassword;
    user.save();

    res.send({ message: "User Registerd Successfully!" });
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  console.log("Inside loginUser API");

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, isDeleted: false });
    if (!user) return res.status(400).send({ message: "User Not Found!" });
    try {
      const response = await bcrypt.compare(password, user.password);
      if (response) {
        const token = await jwt.sign(
          {
            id: user._id,
          },
          process.env.JWT_PRIVATE_KEY
        );

        res.send({ user, token, message: "User Logged In!" });
      } else {
        return res
          .status(400)
          .send({ message: "Invalid Username or Password!" });
      }
    } catch (error) {
      console.log(error);
      return res.status(400).send({ message: "Invalid Username or Password!" });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

// const logoutUser = async (req, res) => {
//   console.log("Inside logoutUser API");

//   try {
//     const { id } = req.user;
//     if (id) {
//       res.status(200).send({
//         message: "User is Log Out",
//       });
//     }
//   } catch (error) {
//     res.status(500).send({
//       message: error.message,
//     });
//   }
// };

const getAllUsers = async (req, res) => {
  console.log("Inside getAllUsers API");
  try {
    const { id } = req.user;
    if (id) {
      const users = await User.find(
        { _id: { $ne: id } }, //not equal to. return all user. related to others not my id user.filter
        { username: 1, email: 1 } //projection
      );
      res.status(200).json(users);
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
};

const sendRequest = async (req, res) => {
  console.log("Inside sendRequest API");
  try {
    const { id: senderID } = req.user; //token
    const { id: recipientID } = req.body; //body
    const requester = await User.findById({ _id: senderID });
    const recipient = await User.findById({ _id: recipientID });
    recipient.friendRequests.push(requester._id);
    await recipient.save();
    res.status(200).send({ message: "Friend request sent" });
  } catch (error) {
    res.status(500).send({ message: "An error occurred" });
  }
};

const acceptRequest = async (req, res) => {
  console.log("Inside acceptRequest API");
  try {
    const { id: acceptorID } = req.user;
    const { id: requesterID } = req.body;
    const user = await User.findById({ _id: acceptorID });
    const requester = await User.findById({ _id: requesterID });

    if (user.friendRequests.includes(requester._id)) {
      // Add each other as friends
      user.friends.push(requester._id);
      requester.friends.push(user._id);
      // Remove friend request
      user.friendRequests.pull(requester._id);
      await requester.save();
      await user.save();
    } else {
      res.send({ message: "Friend request doesn't exists!" });
    }
    res.status(200).send({ message: "Friend request accepted" });
  } catch (error) {
    res.status(500).send({ message: "An error occurred" });
  }
};

const rejectRequest = async (req, res) => {
  console.log("Inside rejectRequest API");
  try {
    const { id: rejectorID } = req.user;
    const { id: requesterID } = req.body;
    const user = await User.findById({ _id: rejectorID });
    const requester = await User.findById({ _id: requesterID });

    if (user.friendRequests.includes(requester._id)) {
      // Remove friend request
      user.friendRequests.pull(requester._id);
      await user.save();
    } else {
      res.send({ message: "Friend request doesn't exists!" });
    }
    res
      .status(200)
      .send({ message: `Friend request rejected by ${user.username}` });
  } catch (error) {
    res.status(500).send({ message: "An error occurred" });
  }
};

const getAllFriendRequests = async (req, res) => {
  console.log("Inside getAllFriendRequests API");
  try {
    const { id } = req.user;
    const user = await User.findById({ _id: id })
      .populate("friendRequests", "username email") //username and email
      .exec();
    res.status(200).send(user.friendRequests); //only request not whole data
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
};

const getAllFriends = async (req, res) => {
  console.log("Inside getAllFriends API");
  try {
    const { id } = req.user;
    const user = await User.findById({ _id: id })
      .populate("friends", "username email")
      .exec();
    res.status(200).send(user.friends);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  // logoutUser,
  getAllUsers,
  sendRequest,
  acceptRequest,
  rejectRequest,
  getAllFriendRequests,
  getAllFriends,
};
