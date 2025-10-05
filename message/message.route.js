const { getMessages, sendMessage } = require("./message.controller");

const { Router } = require("express");

const messageRouter = Router();

messageRouter.get("/:chat_id", getMessages);
messageRouter.post("/:chat_id", sendMessage);

module.exports = {
  messageRouter,
};
