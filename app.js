const express = require("express");
const globalErrorHandler = require("./utils/globalError.controller");
const { uploadRouter } = require("./upload/upload.route");
const { setupMiddlewares } = require("./utils/middleware");

const app = express();

setupMiddlewares(app);

app.get("/status", (req, res) => {
  return res.status(200).json({
    status: "success",
  });
});

app.use("/app/v1/file", uploadRouter);

// Global error handler (should be the last middleware)
app.use(globalErrorHandler);

module.exports = { app };
