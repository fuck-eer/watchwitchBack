const User = require("../models/user");
const brcypt = require("bcrypt");
const jwt = require("jsonwebtoken");
exports.postsignup = (req, res, next) => {
	const name = req.body.name;
	const email = req.body.email;
	const enteredPass = req.body.password;

	User.findOne({ email: req.body.email })
		.then((user) => {
			if (user) {
				const error = new Error("user already exist..");
				error.statusCode = 409;
				throw error;
			}

			return brcypt.hash(enteredPass, 12);
		})
		.then((hashedpw) => {
			const user = new User({
				name,
				email,
				friends: [],
				conversations: [],
				password: hashedpw,
			});

			return user.save();
		})
		.then((savedUser) => {
			res.status(201).json({
				user: { name: savedUser.name, email: savedUser.email },
				msg: "user created successfully",
			});
		})
		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};

exports.postlogin = (req, res, next) => {
	const enteredEmail = req.body.email;
	const enteredPw = req.body.password;
	let fetchedUser;
	User.findOne({ email: enteredEmail })
		.then((loadedUser) => {
			if (!loadedUser) {
				const error = new Error("No Such User Found!");
				error.statusCode = 404;
				throw error;
			}
			fetchedUser = loadedUser;
			return brcypt.compare(enteredPw, loadedUser.password);
		})
		.then((isEqual) => {
			if (!isEqual) {
				const error = new Error("Wrong password");
				error.statusCode = 401;
				throw error;
			}

			const token = jwt.sign(
				{
					email: fetchedUser.email,
					name: fetchedUser.name,
					userId: fetchedUser._id.toString(),
				},
				process.env.SECRET_KEY,
				{ expiresIn: "1h" }
			);

			res.status(200).json({
				_token: token,
				email: fetchedUser.email,
				name: fetchedUser.name,
				expiresIn: 3600,
			});
		})
		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};
