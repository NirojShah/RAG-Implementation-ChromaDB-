// import { Message } from "../chat/chat.model";
// import { CustomError } from "../utils/CustomError";

const { Message } = require("../chat/chat.model");
const { CustomError } = require("../utils/CustomError");

const chatMessages = async ({ chat_id, limit, skip }) => {
  try {
    const messages = await Message.find({
      chat_id,
    })
      // .limit(limit)
      // .skip(skip);

    return {
      success: true,
      messages,
    };
  } catch (err) {
    console.log(err);
    throw new CustomError(err.messages, 500);
  }
};

const createMessage = async ({ chat_id, message, role, user_id }) => {
  try {
    const newMessage = await Message.create({
      chat_id: chat_id,
      content: message,
      role: role,
      user_id: user_id,
    });

    return {
      succes: true,
      message: newMessage,
    };
  } catch (err) {}
};

module.exports = {
  chatMessages,
  createMessage,
};
