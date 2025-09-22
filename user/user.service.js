const jwt = require("jsonwebtoken");
const { CustomError } = require("../utils/CustomError");
const { User } = require("./user.model");

const generateUserId = async () => {
  try {
    const lastUser = await User.countDocuments();
    if (lastUser === 0) {
      return `USR-1`;
    } else return `USR-${lastUser + 1}`;
  } catch (err) {
    throw new CustomError(err.message, 500);
  }
};

const processSignup = async ({ firstName, lastName, email, password }) => {
  try {
    const alreadyPresentUser = await User.findOne({
      email,
    });
    if (alreadyPresentUser) {
      throw new CustomError("please login.", 401);
    }
    const userId = await generateUserId();
    const userInfo = await User.create({
      user_id: userId,
      firstName,
      lastName,
      email,
      password,
    });

    if (userInfo) {
      return {
        message: "user signed up successfully.",
      };
    }
    throw new CustomError("Failed to create user", 401);
  } catch (err) {
    throw new CustomError(err.message, 500);
  }
};

const processLogin = async ({ email, password }) => {
  try {
    const userInfo = await User.findOne({
      email,
      password,
    });

    if (!userInfo) {
      throw new CustomError("Please use correct Credentials.");
    }
    const token = await jwt.sign(
      { email: userInfo.email, user_id: userInfo.user_id },
      process.env.SECRET_KEY,
      { expiresIn: 24 * 60 * 60 }
    );

    return { token: token };
  } catch (err) {
    throw new CustomError(err.message, 404);
  }
};

module.exports = {
  processSignup,
  processLogin,
};
