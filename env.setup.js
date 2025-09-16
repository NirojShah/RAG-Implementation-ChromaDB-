const dotenv = require("dotenv");

const setupEnv = () => {
  console.log(process.env.NODE_ENV);
  let path = "./.env";
  if (process.env.NODE_ENV == "dev") {
    path = "./.env.dev";
  } else if (process.env.NODE_ENV == "prod") {
    path = "./.env.prod";
  }
  dotenv.config({ path });
};

module.exports = { setupEnv };
