// const User = require("../models/user");
const Convo = require("../models/conversation");
const Message = require("../models/message");
exports.getMessages = (req, res, next) => {
	const convoId = req.body.convoId;
	const userId = req.userId;
	Convo.findOne({ _id: convoId })
		.then((convo) => {
			if (!convo) {
				const error = new Error("no_conversation_found");
				error.statusCode = 404;
				throw error;
			}

			const userPresent = convo.memId.findIndex((e) => e.toString() === userId);
			if (userPresent === -1) {
				const error = new Error("not_authorized_to_read");
				error.statusCode = 401;
				throw error;
			}

			return Message.find({ convoId: convoId });
		})
		.then((messages) => {
			res.status(200).json(messages);
		})
		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};

exports.postMessages = (req, res, next) => {
	const userId = req.userId;
	const content = req.body.content;
	const convoId = req.body.convoId;

	const message = new Message({
		convoId,
		content,
		sender: userId,
	});

	message
		.save()
		.then((savedMsg) => {
			s;
			res.status(200).json({ msg: "posted succesfully" });
		})
		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};
