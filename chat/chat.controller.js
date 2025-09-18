const asyncErrorHandler = require("../utils/globalError.controller");

const getChat = asyncErrorHandler(async () => {});

const chat = asyncErrorHandler(async () => {});

const deleteChat = asyncErrorHandler(async () => {});

const history = asyncErrorHandler(async () => {});

module.exports = {
  getChat,
  chat,
  deleteChat,
  history,
};
