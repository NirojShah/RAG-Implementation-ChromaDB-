const { uploadHandler } = require("../upload/upload.service");
const asyncErrorHandler = require("../utils/globalError.controller");
const {
  createChat,
  listOfMyChat,
  processGetChat,
  updateChatFileInfo,
} = require("./chat.service");
const { newChatSchema } = require("./chat.validation");

const chat = asyncErrorHandler(async (req, res) => {
  const payload = newChatSchema.parse({
    ...req.body,
    user_id: req.user.user_id,
  });

  const newchat = createChat(payload);

  res.status(200).json({
    status: "success",
    message: "Chat created successfully",
    data: payload,
  });
});

const getChat = asyncErrorHandler(async (req, res) => {
  const resp = await listOfMyChat({ user_id: req.user.user_id });
  return res.status(200).json({
    status: "success",
    chats: resp,
  });
});

const deleteChat = asyncErrorHandler(async () => {});

const history = asyncErrorHandler(async (req, res) => {
  return res.staus(200).json({
    status: "success",
    chat: resp,
  });
});

const mychat = asyncErrorHandler(async (req, res) => {
  const chat_id = req.params.chat_id;
  console.log(chat_id);
  const resp = await processGetChat({ chat_id });

  return res.status(200).json({
    status: "success",
    chats: resp,
  });
});

const chat_upload_file = asyncErrorHandler(async (req, res) => {
  const file = req.files.file;
  const chat_id = req.body.chat_id;
  const user_id = req.user.user_id;
  const uplaod = await uploadHandler({ file, user_id });
  const resp = await updateChatFileInfo({ file_id: uplaod.file_id, chat_id });
  return res.status(200).json({
    status: "success",
    ...resp,
  });

  // const resp = await
});

module.exports = {
  getChat,
  chat,
  deleteChat,
  history,
  mychat,
  chat_upload_file,
};
