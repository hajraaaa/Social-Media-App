const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const authMiddleware = (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization;

  if (!token)
    return res
      .status(401)
      .send(`Access Denied. User is not authorized to use this route`);

  try {
    const decode = jwt.verify(token.split(" ")[1], process.env.JWT_PRIVATE_KEY);
    req.user = decode;
    next();
  } catch (error) {
    res.status(400).send("Invalid Token!");
  }
};

const isDeletedMiddleware = async (req, res, next) => {
  const { id } = req.user;
  try {
    const user = await User.findOne({ _id: id, isDeleted: false });
    if (!user) return res.send({ message: "User doesn't Exists!" });
    next();
  } catch (error) {
    res.status(500).send(err.message);
  }
};

module.exports = { authMiddleware, isDeletedMiddleware };
