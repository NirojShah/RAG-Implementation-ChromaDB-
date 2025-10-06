const { chatMessages, createMessage } = require("./message.service");
const asyncErrorHandler = require("../utils/globalError.controller");
const { CustomError } = require("../utils/CustomError");
const { askQuestion } = require("../utils/chromadb.setup");
const { chatInformation } = require("../chat/chat.service");

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
  const { text } = req.body;
  const chat_id = req.params.chat_id;
  const role = req.user.role;

  const fileInfo = await chatInformation(chat_id)

  const embeddings = await askQuestion(text,user_id,fileInfo.chatInfo.file_id)

  

  console.log({embeddings})

  // const sendMessage = await createMessage({
  //   chat_id,
  //   message,
  //   role,
  //   user_id,
  // });

  throw new CustomError("EHH",500)


});

module.exports = {
  getMessages,
  sendMessage,
};
