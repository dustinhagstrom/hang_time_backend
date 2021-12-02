const mongoose = require("mongoose");

const strikesSchema = new mongoose.Schema({
  strikes: {
    type: Number,
  },
});

module.exports = mongoose.model("Strikes", strikesSchema);
