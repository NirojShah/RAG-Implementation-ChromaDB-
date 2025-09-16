const { Router } = require("express");
const { handleUpload, askQuery } = require("./upload.controller");

const uploadRouter = Router();

uploadRouter.post("/", handleUpload);
uploadRouter.post("/query", askQuery);

module.exports = { uploadRouter };
