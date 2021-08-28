const express = require("express");
const userController = require("../controllers/user");
const isAuth = require("../middlewares/is-auth");
const route = express.Router();

//not required sofar
route.get("/friendsList", isAuth, userController.friendList);

route.post("/addFriend", isAuth, userController.addFriend);

route.post("/delFriend", isAuth, userController.delFriend);

route.get("/userDetails", isAuth, userController.userDetails);

route.post("/conversations", isAuth, userController.postConvo);

// route.get("/friendDetail", isAuth, userController.friendDetail);

module.exports = route;
