const { app } = require("./app.js");
const http = require("http");
const { setupEnv } = require("./env.setup.js");
const {
  connectToChromaDB,
  checkChromaConnection,
  deleteAllData,
} = require("./utils/chromadb.setup.js");
const { connectToDataBase } = require("./utils/mongodb.connection.js");

setupEnv();
const server = http.createServer(app);
const PORT = process.env.PORT;
const chroma_path = process.env.CHROMA_PATH;
connectToDataBase(process.env.MONGODB_URL)

connectToChromaDB(chroma_path);
checkChromaConnection();
// deleteAllData();

server.listen(PORT, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("server is started." + PORT);
});
