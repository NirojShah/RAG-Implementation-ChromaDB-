const { app } = require("./app.js");
const http = require("http");
const { setupEnv } = require("./env.setup.js");
const {
  connectToChromaDB,
  checkChromaConnection,
} = require("./utils/chromadb.setup.js");

setupEnv();
const server = http.createServer(app);
const PORT = process.env.PORT;
const chroma_path = process.env.CHROMA_PATH;

connectToChromaDB(chroma_path);

checkChromaConnection();

server.listen(PORT, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("server is started." + PORT);
});
