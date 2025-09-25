const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    file_id: { type: String, required: true, unique: true },
    user_id: { type: String, required: true, ref: "User" },
    file_name: { type: String, required: true },
    file_data: { type: Buffer, required: true },
    file_mime: { type: String, required: true },
  },
  { timestamps: true }
);

const File = mongoose.model("File", fileSchema);

module.exports = { File };
