const mongoose = require("mongoose");

const DataSchema = new mongoose.Schema({
  name: String,
  age: Number,
  email: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Data", DataSchema);