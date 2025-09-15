// chroma.js
import { ChromaClient } from "chromadb";
import { getEmbedding } from "./llm.js";

const chroma = new ChromaClient({ path: "http://localhost:8000" });

// Create or fetch collection
export async function getCollection(name = "docs") {
  return await chroma.getOrCreateCollection({ name });
}

// Add a document to Chroma
export async function addDocument(id, text) {
  const collection = await getCollection();
  const embedding = await getEmbedding(text);

  await collection.add({
    ids: [id],
    documents: [text],
    embeddings: [embedding],
  });

  console.log(`✅ Document added with ID: ${id}`);
}

// Query Chroma and fallback to LLM if nothing found
import { chatWithLLM } from "./llm.setup.js";

export async function askQuestion(question) {
  const collection = await getCollection();
  const queryEmbedding = await getEmbedding(question);

  const results = await collection.query({
    queryEmbeddings: [queryEmbedding],
    nResults: 1,
  });

  if (results.documents?.[0]?.length) {
    console.log("📂 Answer from ChromaDB");
    return results.documents[0][0];
  } else {
    console.log("🧠 Answer from LLM");
    return await chatWithLLM(question);
  }
}
