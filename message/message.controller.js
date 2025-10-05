const { chatMessages, createMessage } = require("./message.service");
const asyncErrorHandler = require("../utils/globalError.controller");

const getMessages = asyncErrorHandler(async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const { chat_id } = req.query;
  const skip = page - 1 * limit;


  const messages = await chatMessages({ chat_id, limit, skip });

  return res.status(200).json(messages);
});

const sendMessage = asyncErrorHandler(async (req, res) => {
  const { user_id } = req.user;
  const { message } = req.body;
  const chat_id = req.params.chat_id;
  const role = req.user.role;
  const sendMessage = await createMessage({
    chat_id,
    message,
    role,
    user_id,
  });
});

module.exports = {
  getMessages,
  sendMessage,
};
