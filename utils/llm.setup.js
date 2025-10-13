// llm.js
const { Ollama } = require("ollama");

const ollama = new Ollama();

// Generate embeddings for a text
async function getEmbedding(text) {
  const embedding = await ollama.embeddings({
    model: "nomic-embed-text", // embedding model
    prompt: text,
  });
  return embedding.embedding;
}

// Chat with Ollama (LLM fallback)
async function chatWithLLM(question, embeddings) {
  try {
    const context = embeddings || "";
    const response = await ollama.chat({
      model: "deepseek-r1:1.5b",
      messages: [
        {
          role: "system",
          content: "You are an assistant that uses context to answer precisely.",
        },
        {
          role: "user",
          content: `${context ? `Context:\n${context}\n\n` : ""}Question: ${question}`,
        },
      ],
    });

    return response.message.content;
  } catch (error) {
    console.error("LLM error:", error);
    throw new Error("Failed to get response from LLM");
  }
}


module.exports = {
  getEmbedding,
  chatWithLLM,
};
