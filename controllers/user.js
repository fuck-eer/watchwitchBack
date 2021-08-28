const User = require("../models/user");
const Convo = require("../models/conversation");
exports.userDetails = (req, res, next) => {
	console.log(req.userId);
	const userId = req.userId;
	User.findOne({ _id: userId })
		.select("-_id -password")
		.then((user) => {
			if (!user) {
				const error = new Error("no_user_Found");
				error.statusCode = 404;
				throw error;
			}
			return res.status(200).json(user);
		})
		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};

exports.addFriend = (req, res, next) => {
	const userId = req.userId;
	const friendId = req.body.friendId;
	let owner;
	User.findOne({ _id: userId })
		.then((user) => {
			if (!user) {
				const error = new Error("no_user_Found");
				error.statusCode = 404;
				throw error;
			}
			owner = user;
			return User.findOne({ _id: friendId }).select(
				"-password -friends -conversations"
			);
		})
		.then((friend) => {
			if (!friend) {
				const error = new Error("entered_friend_Found");
				error.statusCode = 404;
				throw error;
			}

			return owner.addFriend(friend);
		})
		.then((resp) => {
			if (resp === "already present") {
				return res.status(304).json({ msg: "already friends" });
			} else if (resp === "are you that lonley!?") {
				return res.status(304).json({ msg: "are you that lonley!?" });
			}
			return res.status(200).json({ msg: "friend added successfully" });
		})
		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};

exports.delFriend = (req, res, next) => {
	const userId = req.userId;
	const friendId = req.body.friendId;
	User.findOne({ _id: userId })
		.select("-password")
		.then((user) => {
			if (!user) {
				const error = new Error("no_such_user_found");
				error.statusCode = 404;
				throw error;
			}
			return user.removeFriend(friendId);
		})
		.then((resp) => {
			if (resp === "Not in your FriendList") {
				res.status(304).json({ msg: "person was not in your friendList" });
			}

			res.status(200).json({ msg: "person is no longer in your friendList" });
		})
		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};

exports.friendList = (req, res, next) => {
	const userId = req.userId;

	User.findOne({ _id: userId })
		.select("friends -_id")
		.populate({ path: "friends", select: "name" })
		.then((userFriends) => {
			// console.log(userFriends);

			if (!userFriends) {
				const error = new Error("NO_FRIENDS_PRESENT");
				error.statusCode = 404;
				throw error;
			}

			return res.status(200).json(userFriends);
		})
		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};

exports.postConvo = (req, res, next) => {
	const userId = req.userId;
	const friendId = req.body.friendId;

	Convo.findOne({ memId: { $all: [userId, friendId] } })
		.then((convo) => {
			if (!convo) {
				const convo = new Convo({ memId: [userId, friendId] });
				return convo.save();
			}

			return res.status(200).json(convo);
		})
		.then((savedConvo) => {
			User.findOne({ _id: userId }).then((user) => {
				if (!user) {
					const error = new Error("NO_USER_FOUND");
					error.status = 404;
					throw error;
				}

				return user.addConversation(savedConvo);
			});

			return res.status(200).json(savedConvo);
		})
		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};
