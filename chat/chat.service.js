const { CustomError } = require("../utils/CustomError");
const { Chat, Message } = require("./chat.model");

// Generate incremental Chat IDs
const generateChat_Id = async () => {
  const chat = await Chat.findOne().sort({ _id: -1 }).select("chat_id");
  if (!chat) {
    return "CHAT_ID-1";
  } else {
    let endNo = Number(chat.chat_id.split("-")[1]) || 0;
    return `CHAT_ID-${endNo + 1}`;
  }
};

// Create new chat
const createChat = async ({ chat_name, user_id }) => {
  try {
    let chat_id = await generateChat_Id();
    const newchat = await Chat.create({
      chat_id,
      chat_name,
      user_id,
    });
    return newchat;
  } catch (err) {
    throw new CustomError(err.message, 500);
  }
};

// Get single chat info
const processGetChat = async ({ chat_id }) => {
  try {
    const chat = await Chat.findOne({ chat_id }).select(
      "chat_id chat_name file_id"
    );
    if (!chat) throw new CustomError("Chat not found", 404);

    if (!chat.file_id) {
      return {
        chat_id: chat.chat_id,
        file: "file not available",
        chat_name: chat.chat_name,
      };
    }
    return chat;
  } catch (error) {
    throw new CustomError(error.message, 401);
  }
};

// List all chats of a user
const listOfMyChat = async ({ user_id }) => {
  try {
    const chats = await Chat.find({ user_id }).select("chat_id chat_name");
    return {
      success: true,
      chats,
    };
  } catch (err) {
    throw new CustomError(err.message, 401);
  }
};

// Update chat file info
const updateChatFileInfo = async ({ chat_id, file_id }) => {
  try {

    console.log(chat_id,file_id)

    const updatedChat = await Chat.findOneAndUpdate(
      { chat_id: chat_id },
      { $set: { file_id } },
      { new: true }
    );

    console.log(updatedChat)

    if (!updatedChat) {
      throw new CustomError("Chat not found", 404);
    }

    return { message: "success", chat: updatedChat };
  } catch (err) {
    throw new CustomError(err.message, 500);
  }
};

// =========================
// Message Functions
// =========================

// Send message
const sendMessages = async ({ chat_id, sender_id, content }) => {
  try {
    const chat = await Chat.findOne({ chat_id });
    if (!chat) throw new CustomError("Chat not found", 404);

    const message = await Message.create({
      chat_id,
      sender_id,
      content,
    });

    return message;
  } catch (err) {
    throw new CustomError(err.message, 500);
  }
};

// Delete message
const deleteMessage = async ({ message_id }) => {
  try {
    const msg = await Message.findOneAndDelete({ message_id });
    if (!msg) throw new CustomError("Message not found", 404);

    return { message: "Message deleted successfully" };
  } catch (err) {
    throw new CustomError(err.message, 500);
  }
};

// Get all chat history
const listHistory = async ({ chat_id }) => {
  try {
    const messages = await Message.find({ chat_id }).sort({ createdAt: 1 });
    return messages;
  } catch (err) {
    throw new CustomError(err.message, 500);
  }
};

// Delete entire chat + messages
const deleteChat = async ({ chat_id }) => {
  try {
    const chat = await Chat.findOneAndDelete({ chat_id });
    if (!chat) throw new CustomError("Chat not found", 404);

    await Message.deleteMany({ chat_id });

    return { message: "Chat and its messages deleted successfully" };
  } catch (err) {
    throw new CustomError(err.message, 500);
  }
};

const chatInformation = async (chat_id) => {
  try {
    const chatInfo = await Chat.findOne({ chat_id }).select("");
    return { success: true, chatInfo };
  } catch (err) {
    throw new CustomError(err.message, 500);
  }
};

module.exports = {
  createChat,
  sendMessages,
  deleteMessage,
  listHistory,
  deleteChat,
  listOfMyChat,
  processGetChat,
  updateChatFileInfo,
  chatInformation,
};
