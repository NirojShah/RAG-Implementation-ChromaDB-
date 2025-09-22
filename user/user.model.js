const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  user_id: {
    type: String,
    required: true,
  },
  email: { type: String, required: true, unique: true },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = model("Users", userSchema);

module.exports = {
  User,
};
