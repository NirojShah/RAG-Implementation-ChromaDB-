const asyncErrorHandler = require("../utils/globalError.controller");
const { uploadHandler, testing } = require("./upload.service");

const handleUpload = asyncErrorHandler(async (req, res) => {
  const { file } = req.files;

  const resp = await uploadHandler({ file });
  return res.status(200).json({
    status: "success",
    message: "test successfull.",
  });
});

const askQuery = asyncErrorHandler(async (req, res) => {
  const { query } = req.body;
  const resp = await testing(query);
  return res.status(200).json({
    status: "success",
    data: resp,
  });
});

module.exports = {
  handleUpload,
  askQuery,
};
