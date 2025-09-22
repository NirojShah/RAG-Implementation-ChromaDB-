const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    chat_id: {
      type: String,
      required: true,
      unique: true,
    },
    chat_name: {
      type: String,
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },
    file_id: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const messagesSchema = new mongoose.Schema(
  {
    message_id: {
      type: String,
      required: true,
      unique: true,
    },
    chat_id: {
      type: String,
      required: true,
      ref: "Chat",
    },
    user_id: {
      type: String,
      required: true,
      ref: "User",
    },
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);
const Message = mongoose.model("Message", messagesSchema);

module.exports = { Chat, Message };
