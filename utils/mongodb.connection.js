const mongoose = require("mongoose");

const connectToDataBase = (db_url) => {
  mongoose
    .connect(db_url)
    .then(() => {
      console.log("mongodb connected.");
    })
    .catch((err) => {
      console.log(err.message);
    });
};

module.exports = {
  connectToDataBase,
};
