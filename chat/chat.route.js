const { Router } = require("express");

const chatRouter = Router();

chatRouter.post("/");
chatRouter.get("/");
chatRouter.post("/send");
chatRouter.get("/history");
chatRouter.delete("/:chatId");

module.exports = {
  chatRouter,
};
