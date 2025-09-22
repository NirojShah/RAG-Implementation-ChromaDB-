const { CustomError } = require("../utils/CustomError");
const { Chat } = require("./chat.model");

const generateChat_Id = async () => {
  const chat = await Chat.findOne().sort({ _id: -1 }).select("chat_id");
  if (chat == null) {
    return "CHAT_ID-1";
  } else {
    let endNo = chat.chat_id.split("-")[1] * 1;
    let chat_id = `CHAT_ID-${endNo + 1}`;
    return chat_id;
  }
};

const createChat = async ({ chat_name, user_id }) => {
  try {
    let chat_id = await generateChat_Id();
    const newchat = await Chat.create({
      chat_id: chat_id,
      chat_name: chat_name,
      user_id: user_id,
    });
    return newchat;
  } catch (err) {
    throw new CustomError(err.message, 500);
  }
};

const processGetChat = async ({ chat_id }) => {
  try {
    const chat = await Chat.findOne({ chat_id }).select(
      "chat_id chat_name file_id"
    );
    if (!chat.file_id) {
      return {
        chat_id: chat.chat_id,
        file: "file not available",
        chat_name: chat.chat_name,
      };
    }
    return chat;
  } catch (error) {
    throw new CustomError(err.message, 401);
  }
};

const sendMessages = async ({ data }) => {};

const deleteMessage = async ({ data }) => {};

const listHistory = async ({ data }) => {};

const deleteChat = async ({ data }) => {};

const listOfMyChat = async ({ user_id }) => {
  try {
    const listOfchat = await Chat.find({
      user_id,
    }).select("chat_id chat_name");

    return listOfchat;
  } catch (err) {
    throw new CustomError(err.message, 401);
  }
};

const updateChatFileInfo = async ({ chat_id, file_id }) => {
  try {
    await Chat.findOneAndUpdate({
      chat_id: chat_id,
      $set: {
        file_id: file_id,
      },
    });
    return {
      message: "success",
    };
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
};
