const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const bodyParser = require("body-parser");
const userRoutes = require("./routes/user");
const messageRoutes = require("./routes/message");
const authRoutes = require("./routes/auth");
const port = process.env.PORT || 3050;
const app = express();
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
	next();
});
app.use(bodyParser.json());
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
// app.use("/message", messageRoutes);
app.get("/", (req, res, next) => {
	res.send(
		`<h1 style="text-align: center;">welcome to witchwatch backend servers</h1>`
	);
});
app.use((err, req, res, next) => {
	const statusCode = err.statusCode || 500;
	const errorMessage = err.message || "something went wrong!";
	const errorData = err.data || "something went wrong!";
	res.status(statusCode).json({ message: errorMessage, data: errorData });
});
mongoose
	.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then((e) => {
		console.log("connected");
		app.listen(port);
	})
	.catch((err) => {
		console.log("something went wrong");
		console.log(err);
	});
