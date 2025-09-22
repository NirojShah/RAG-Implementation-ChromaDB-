const pdfParse = require("pdf-parse");
const { addDocument, askQuestion } = require("../utils/chromadb.setup");
const { chatWithLLM } = require("../utils/llm.setup");
const { CustomError } = require("../utils/CustomError");
const { File } = require("../files/file.model");

const cleanAnswer = (text) =>
  text.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

const generateFileId = async () => {
  const count = await File.countDocuments();
  if (count == 0) {
    return `FILE-ID-1`;
  }
  return `FILE-ID-${count + 1}`;
};

function chunkText(text, chunkSize = 500) {
  const words = text.split(" ");
  const chunks = [];
  let current = [];

  for (let word of words) {
    current.push(word);
    if (current.join(" ").length > chunkSize) {
      chunks.push(current.join(" "));
      current = [];
    }
  }
  if (current.length > 0) chunks.push(current.join(" "));
  return chunks;
}

const uploadHandler = async ({ file, user_id }) => {
  const fileId = await generateFileId();
  const uploadedfile = await File.create({
    file_data: file.data,
    file_name: file.name,
    file_id: fileId,
    user_id: user_id,
    file_mime: file.mimetype,
  });

  const pdfcontent = await pdfParse(file.data);
  const fullText = pdfcontent.text;
  const chunks = chunkText(fullText, 500);

  const baseId = file.name || `doc_${Date.now()}`;

  for (let i = 0; i < chunks.length; i++) {
    await addDocument(`${baseId}_${i}`, chunks[i], fileId, user_id);
  }

  return {
    file_id: uploadedfile.file_id,
    status: "success",
    message: "Uploaded successfully",
  };
};

const testing = async (query, user_id, file_id) => {
  const x = await askQuestion(query, user_id, file_id);

  const queryWithContent = `
Answer clearly and concisely. 
Use only the context below if needed.

Question: ${query}
Context: ${x}
`;

  const resp = await chatWithLLM(queryWithContent);

  return {
    context: x,
    answer: cleanAnswer(resp.trim()),
  };
};

module.exports = {
  uploadHandler,
  testing,
};
