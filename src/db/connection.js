const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/registerdb")
  .then(() => {
    console.log("Connected Successfully..");
  })
  .catch((e) => {
    console.log("DB failed to connect");
  });
