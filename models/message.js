const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema(
	{
		convoId: {
			type: Schema.Types.ObjectId,
			ref: "Conversation",
		},
		sender: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
		content: {
			type: String,
			required: true,
		},
	},
	{ timestamps: { createdAt: "sentAt" } }
);

module.exports = mongoose.model("Message", messageSchema);
