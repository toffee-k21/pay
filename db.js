const mongoose = require('mongoose')

 const connectDb = mongoose
  .connect("mongodb://localhost:27017/payTm")
  .then(console.log("mongoDb connected"));

  module.exports = connectDb;