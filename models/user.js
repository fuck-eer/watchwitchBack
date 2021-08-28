const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true,
	},
	name: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	friends: [{ type: Schema.Types.ObjectId, required: true, ref: "User" }],
	conversations: [{ type: Schema.Types.ObjectId, ref: "Conversation" }],
});

userSchema.methods.addFriend = function (friend) {
	if (friend._id === this._id) {
		return "are you that lonley!?";
	}

	const friendIndex = this.friends.findIndex(
		(e) => e.friendId.toString() === friend._id.toString()
	);

	if (friendIndex !== -1) {
		return "already present";
	}

	const updatedFriends = [...this.friends];

	updatedFriends.push(friend._id);
	this.friends = updatedFriends;
	return this.save();
};

userSchema.methods.removeFriend = function (friendId) {
	const friendIndex = this.friends.findIndex(
		(e) => e.toString() === friendId.toString()
	);
	if (friendIndex === -1) {
		return "Not in your FriendList";
	}

	const updatedFriends = [...this.friends];
	updatedFriends.splice(friendIndex, 1);

	this.friends = updatedFriends;

	return this.save();
};

userSchema.methods.addConversation = function (converstion) {
	const convoIndex = this.conversations.findIndex((e) => {
		return e.toString() === converstion._id.toString();
	});

	if (convoIndex !== -1) {
		console.log("conversation already present!");
	}

	const updatedConvos = [...this.conversations, converstion._id];

	this.conversations = updatedConvos;

	return this.save();
};
userSchema.methods.deleteConversation = function (convoId) {
	const convoIndex = this.conversations.findIndex((e) => {
		return e.toString() === convoId.toString();
	});

	if (convoIndex === -1) {
		console.log("conversation not present!");
	}

	const updatedConvos = [...this.conversations];
	updatedConvos.splice(convoIndex, 1);
	this.conversations = updatedConvos;

	return this.save();
};

module.exports = mongoose.model("User", userSchema);
