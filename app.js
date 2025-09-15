const express = require("express");
const { setupMiddlewares } = require("./utils/middleware");
const { globalErrorHandler } = require("./utils/globalError.controller");
const { uploadRouter } = require("./upload/upload.route");
const asyncErrorHandler = require("./utils/globalError.controller");

const app = express();
setupMiddlewares(app);

app.use("/app/v1/file", uploadRouter);

app.use(asyncErrorHandler);
module.exports = { app };
