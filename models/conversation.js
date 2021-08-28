const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const conversationSchema = new Schema({
	members: [{ memId: { type: Schema.Types.ObjectId, ref: "User" } }],
});

module.exports = mongoose.model("Conversation", conversationSchema);
