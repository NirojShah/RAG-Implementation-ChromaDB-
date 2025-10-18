const { User } = require("../user/user.model");
const { CustomError } = require("./CustomError");
const jwt = require("jsonwebtoken");

const authenticateUser = async (req, res, next) => {
  try {
    let userToken = req.headers.authorization;
    if (!userToken) {
      throw new CustomError("Please login.", 401);
    }
    userToken = userToken.split(" ")[1];
    const validation = jwt.verify(userToken, process.env.SECRET_KEY);
    if (!validation.user_id) {
      throw new CustomError("Invalid token.", 401);
    }
    const exists = await User.exists({ user_id: validation.user_id });
    if (!exists) {
      throw new CustomError("User info not found", 404);
    }
    req.user = {
      email: validation.email,
      user_id: validation.user_id,
    };
    return next(); // ✅ stop execution
  } catch (err) {
    throw new CustomError(err.message, 500);
  }
};

module.exports = { authenticateUser };
