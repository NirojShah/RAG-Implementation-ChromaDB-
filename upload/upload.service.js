const pdfParse = require("pdf-parse");
const { addDocument, askQuestion } = require("../utils/chromadb.setup");
const { chatWithLLM } = require("../utils/llm.setup");

const cleanAnswer = (text) =>
  text.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

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

const uploadHandler = async ({ file }) => {
  // Extract text from PDF
  const pdfcontent = await pdfParse(file.data);
  const fullText = pdfcontent.text; // ✅ this is the actual text

  // Chunk text for vector DB storage
  const chunks = chunkText(fullText, 500);

  // Use filename or timestamp as base ID
  const baseId = file.name || `doc_${Date.now()}`;

  for (let i = 0; i < chunks.length; i++) {
    await addDocument(`${baseId}_${i}`, chunks[i]);
  }

  console.log(`✅ Stored ${chunks.length} chunks for ${baseId}`);
};

const testing = async (query) => {
  const x = await askQuestion(query, { limit: 3 });

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
