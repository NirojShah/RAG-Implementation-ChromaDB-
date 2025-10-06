const { Router } = require("express");
const {
  chat,
  getChat,
  deleteChat,
  history,
  mychat,
  chat_upload_file,
  chatInfo,
} = require("./chat.controller");

const chatRouter = Router();

chatRouter.post("/", chat);
chatRouter.get("/", getChat);
chatRouter.get("/history", history);
chatRouter.delete("/:chatId", deleteChat);
chatRouter.get("/mychat/:chat_id", mychat);
chatRouter.post("/upload-file", chat_upload_file);

chatRouter.get("/:chat_id",chatInfo)

module.exports = {
  chatRouter,
};
