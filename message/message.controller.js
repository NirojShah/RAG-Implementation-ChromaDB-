const { chatMessages, createMessage } = require("./message.service");
const asyncErrorHandler = require("../utils/globalError.controller");
const { CustomError } = require("../utils/CustomError");
const { askQuestion } = require("../utils/chromadb.setup");
const { chatInformation } = require("../chat/chat.service");
const { chatWithLLM } = require("../utils/llm.setup");

const getMessages = asyncErrorHandler(async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const { chat_id } = req.params;
  const skip = page - 1 * limit;

  const messages = await chatMessages({ chat_id, limit, skip });

  return res.status(200).json(messages);
});

const sendMessage101 = asyncErrorHandler(async (req, res) => {
  const { user_id } = req.user;
  const { text } = req.body;
  const chat_id = req.params.chat_id;
  const role = req.user.role;
  const fileInfo = await chatInformation(chat_id)
  const embeddings = await askQuestion(text,user_id,fileInfo.chatInfo.file_id)

  const resp = await chatWithLLM(text,embeddings)

  const sendMessage = await createMessage({
    chat_id,
    message,
    role,
    user_id,
  });

  throw new CustomError("EHH",500)


});


// import { Readable } from "stream";
// import ollama from "ollama";

const {Ollama} = require("ollama")
const {Readable}  = require("stream")

const ollama = new Ollama()

const sendMessage = asyncErrorHandler(async (req, res) => {
  const { user_id } = req.user;
  const { text } = req.body;
  const chat_id = req.params.chat_id;
  const role = req.user.role;
  const fileInfo = await chatInformation(chat_id);

  // Ownership check
  if (fileInfo.chatInfo.user_id !== user_id && role !== 'admin') {
    res.write("data: [ERROR]\n\n");
    res.end();
    return res.status(403).json({ error: 'Unauthorized' });
  }

  // Handle no file case
  if (!fileInfo.chatInfo.file_id) {
    res.write("data: [ERROR] No file uploaded for context.\n\n");
    res.end();
    return;
  }

  let userMessage;
  try {
    userMessage = await createMessage({
      chat_id,
      message: text,
      role: "user",
      user_id,
      createdAt: new Date().toISOString(), // Add createdAt
    });
  } catch (error) {
    console.error("Error creating user message:", error);
    res.write("data: [ERROR]\n\n");
    res.end();
    return;
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  try {
    const embeddings = await askQuestion(text, user_id, fileInfo.chatInfo.file_id);
    // Assuming embeddings is an array of { text: string, ... } - process to text
    const contextText = embeddings;

    const stream = await ollama.chat({
      model: "deepseek-r1:1.5b", // Verify model name; might be 'deepseek-coder:1.5b' or similar
      stream: true,
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that answers questions using the provided document context.",
        },
        {
          role: "user",
          content: `Context:\n${contextText}\n\nQuestion:\n${text}`,
        },
      ],
    });

    let assistantMessage = "";
    for await (const chunk of stream) {
      const token = chunk?.message?.content || "";
      assistantMessage += token;
      res.write(`data: ${token}\n\n`);
    }

    await createMessage({
      chat_id,
      message: assistantMessage,
      role: "assistant",
      user_id,
      createdAt: new Date().toISOString(), // Add createdAt
    });
    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    console.error("LLM stream error:", error);
    res.write("data: [ERROR]\n\n");
    res.end();
  }
});


module.exports = {
  getMessages,
  sendMessage,
};
