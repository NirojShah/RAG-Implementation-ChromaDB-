const { ChromaClient } = require("chromadb");
const { getEmbedding } = require("./llm.setup.js"); // fixed import

let chroma;

const connectToChromaDB = (db_path) => {
  chroma = new ChromaClient({ path: db_path });
};

// Check connection
async function checkChromaConnection() {
  try {
    await chroma.listCollections(); // simple ping
    console.log("✅ Connected to ChromaDB");
    return true;
  } catch (err) {
    console.error("❌ Could not connect to ChromaDB:", err.message);
    return false;
  }
}

// Create or fetch collection
async function getCollection(name = "docs") {
  return await chroma.getOrCreateCollection({ name });
}

// Add a document to Chroma
async function addDocument(id, text) {
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
const { chatWithLLM } = require("./llm.setup.js");

async function askQuestion(question) {
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

module.exports = {
  checkChromaConnection,
  getCollection,
  addDocument,
  askQuestion,
  connectToChromaDB,
};
