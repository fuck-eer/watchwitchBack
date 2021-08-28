const express = require("express");
const authcontroller = require("../controllers/auth");

const route = express.Router();

route.post("/signup", authcontroller.postsignup);

route.post("/login", authcontroller.postlogin);

module.exports = route;
