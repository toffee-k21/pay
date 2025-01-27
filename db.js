const mongoose = require('mongoose')

 const connectDb = mongoose
  .connect("mongodb://localhost:27017/e-comm-dash")
  .then(console.log("mongoDb connected"));

  module.exports = connectDb;