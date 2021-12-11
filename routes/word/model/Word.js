const mongoose = require("mongoose");

const wordSchema = new mongoose.Schema({
  word: {
    type: String,
  },
  emptyLetters: {
    type: Number,
  },
  correctLetters: {
    type: Array,
  },
  incorrectLetters: {
    type: Array,
  },
  gameID: {
    type: String,
  },
  playerOne: {
    type: mongoose.ObjectId,
    ref: "User",
  },
  playerTwo: {
    type: mongoose.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Word", wordSchema);
