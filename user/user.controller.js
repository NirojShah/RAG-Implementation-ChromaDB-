const asyncErrorHandler = require("../utils/globalError.controller");
const { User } = require("./user.model");
const { processSignup, processLogin } = require("./user.service");
const { signupSchema, loginSchema } = require("./user.validation");

const signup = asyncErrorHandler(async (req, res) => {
  const payload = signupSchema.parse(req.body);
  const createUser = await processSignup({ ...payload });
  return res.status(200).json(createUser);
});

const login = asyncErrorHandler(async (req, res) => {
  try {
    const payload = loginSchema.parse(req.body);
    const loginInfoo = await processLogin({ ...payload });
    return res.status(200).json(loginInfoo);
  } catch (err) {
    throw new Error(err.messsage);
  }
});

module.exports = {
  signup,
  login,
};
