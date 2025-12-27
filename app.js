const express = require("express");
const globalErrorHandler = require("./utils/globalError.controller");
const { uploadRouter } = require("./upload/upload.route");
const { setupMiddlewares } = require("./utils/middleware");
const { userRouter } = require("./user/user.route");
const { authenticateUser } = require("./utils/user.auth");
const { chatRouter } = require("./chat/chat.route");
const {messageRouter} = require("./message/message.route")

const app = express();
setupMiddlewares(app);
app.get("/status", (req, res) => {
  return res.status(200).json({
    status: "success",
  });
});
app.use("/app/v1/user", userRouter);
app.use("/app/v1/file", authenticateUser, uploadRouter);
app.use("/app/v1/chat", authenticateUser, chatRouter);
app.use("/app/v1/message",authenticateUser, messageRouter)

app.use(globalErrorHandler);
module.exports = { app };
