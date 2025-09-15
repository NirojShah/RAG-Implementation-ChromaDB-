// llm.js
import { Ollama } from "ollama";

const ollama = new Ollama();

// Generate embeddings for a text
export async function getEmbedding(text) {
  const embedding = await ollama.embeddings({
    model: "nomic-embed-text", // embedding model
    prompt: text,
  });
  return embedding.embedding;
}

// Chat with Ollama (LLM fallback)
export async function chatWithLLM(question) {
  const response = await ollama.chat({
    model: "llama3.1", // or any model you pulled in Ollama
    messages: [{ role: "user", content: question }],
  });
  return response.message.content;
}
