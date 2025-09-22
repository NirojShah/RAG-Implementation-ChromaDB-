const express = require("express");
const globalErrorHandler = require("./utils/globalError.controller");
const { uploadRouter } = require("./upload/upload.route");
const { setupMiddlewares } = require("./utils/middleware");
const { userRouter } = require("./user/user.route");
const { authenticateUser } = require("./utils/user.auth");
const { chatRouter } = require("./chat/chat.route");

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

// Global error handler (should be the last middleware)
app.use(globalErrorHandler);

module.exports = { app };
