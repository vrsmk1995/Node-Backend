const response = require("mongoose");
response
  .connect("mongodb://127.0.0.1:27017/nodebackend")

  .then(() => {
    console.log("Connected to mongoose database successfully");
  })
  .catch((err) => {
    console.log("error connecting to mongoose data base");
    console.log(err);
  });
module.exports = response;
