const cors = require("cors");
const fileUpload = require("express-fileupload");
const express = require("express");

const setupMiddlewares = (app) => {
  app.use(cors());
  app.use(fileUpload()); // enables file uploads
  app.use(express.json());
};

module.exports = {
  setupMiddlewares,
};
