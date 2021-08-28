const express = require("express");
const messageController = require("../controllers/message");
const route = express.Router();

route.get("/allMessages/:convId", messageController.getMessages);

route.post("/allMessages/:convId", messageController.postMessages);

module.exports = route;
