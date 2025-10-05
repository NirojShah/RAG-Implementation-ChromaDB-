const { Router } = require("express");
const {
  chat,
  getChat,
  deleteChat,
  history,
  mychat,
  chat_upload_file,
} = require("./chat.controller");

const chatRouter = Router();

chatRouter.post("/", chat);
chatRouter.get("/", getChat);
// chatRouter.post("/send",send);
chatRouter.get("/history", history);
chatRouter.delete("/:chatId", deleteChat);
chatRouter.get("/mychat/:chat_id", mychat);
chatRouter.post("/upload-file", chat_upload_file);

chatRouter.get("/:chat_id",()=>{console.log("ehh boii")})

module.exports = {
  chatRouter,
};
