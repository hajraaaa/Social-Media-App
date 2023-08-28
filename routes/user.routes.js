const express = require("express");

const {
  registerUser,
  loginUser,
  getAllUsers,
  sendRequest,
  acceptRequest,
  rejectRequest,
  getAllFriendRequests,
  getAllFriends,
  // logoutUser,
} = require("../controllers/user.controller");

const {
  authMiddleware,
  isDeletedMiddleware,
} = require("../middlewares/auth.middleware");

const routes = express.Router();

routes.post("/register", registerUser);
routes.post("/login", loginUser);
// routes.post("/logout", authMiddleware, isDeletedMiddleware, logoutUser);

routes.get("/get-all-users", authMiddleware, isDeletedMiddleware, getAllUsers);

routes.post("/send-request", authMiddleware, isDeletedMiddleware, sendRequest);

routes.put(
  "/accept-request",
  authMiddleware,
  isDeletedMiddleware,
  acceptRequest
);
routes.put(
  "/reject-request",
  authMiddleware,
  isDeletedMiddleware,
  rejectRequest
);

routes.get(
  "/get-all-friend-requests",
  authMiddleware,
  isDeletedMiddleware,
  getAllFriendRequests
);
routes.get(
  "/get-all-friends",
  authMiddleware,
  isDeletedMiddleware,
  getAllFriends
);

module.exports = routes;
