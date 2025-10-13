const { chatWithLLM } = require("./llm.setup.js");
const { ChromaClient } = require("chromadb");
const { getEmbedding } = require("./llm.setup.js"); // fixed import

let chroma;

const connectToChromaDB = (db_path) => {
  chroma = new ChromaClient({ path: db_path });
};

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

async function getCollection(name = "docs") {
  return await chroma.getOrCreateCollection({ name });
}

async function addDocument(id, text, fileId, userId) {
  const collection = await getCollection(); // get Chroma collection
  const embedding = await getEmbedding(text); // generate vector embedding

  await collection.add({
    ids: [id],
    documents: [text],
    embeddings: [embedding],
    metadatas: [{ fileId, userId }],
  });

  console.log(`Document added with ID: ${id} for File: ${fileId}`);
}


// Query Chroma and fallback to LLM if nothing found

async function askQuestion(question, userId, fileId) {
  const collection = await getCollection();
  const queryEmbedding = await getEmbedding(question);

  const results = await collection.query({
    queryEmbeddings: [queryEmbedding],
    nResults: 1,
    where: {
      fileId: { $eq: fileId },
    },
  });

  if (results.documents?.[0]?.length) {
    console.log("Answer from ChromaDB");
    return results.documents[0][0];
  } else {
    console.log("Answer from LLM");
    return await chatWithLLM(question);
  }
}
// Delete ALL collections (wipe ChromaDB)
async function deleteAllData() {
  try {
    const collections = await chroma.listCollections();
    for (const col of collections) {
      await chroma.deleteCollection({ name: col.name });
      console.log(`Deleted collection: ${col.name}`);
    }
    console.log("All ChromaDB data deleted");
  } catch (err) {
    console.error("Failed to delete ChromaDB data:", err.message);
  }
}

module.exports = {
  checkChromaConnection,
  getCollection,
  addDocument,
  askQuestion,
  connectToChromaDB,
  deleteAllData,
};
