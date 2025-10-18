// import { Message } from "../chat/chat.model";
// import { CustomError } from "../utils/CustomError";

const { Message } = require("../chat/chat.model");
const { CustomError } = require("../utils/CustomError");
const { generateId } = require("../utils/generate_id");

const chatMessages = async ({ chat_id, limit, skip }) => {
  try {

    const messages = await Message.find({
      chat_id,
    })
    return {
      success: true,
      messages,
    };
  } catch (err) {
    throw new CustomError(err.messages, 500);
  }
};

const createMessage = async ({ chat_id, message, role, user_id }) => {
  try {
    
    const messageId = await generateId(Message,"message_id","MESSAGE")
    const newMessage = await Message.create({
      chat_id: chat_id,
      content: message,
      role: role,
      user_id: user_id,
      message_id: messageId
    });

    return {
      succes: true,
      message: newMessage,
    };
  } catch (err) {
    console.log(err)
  }
};

module.exports = {
  chatMessages,

  createMessage,
};
