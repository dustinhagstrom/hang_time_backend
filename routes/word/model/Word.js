const mongoose = require("mongoose");

const wordSchema = new mongoose.Schema({
  word: {
    type: String,
  },
});

module.exports = mongoose.model("Word", wordSchema);
