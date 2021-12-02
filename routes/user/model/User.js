const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: { type: String },
  email: { type: String, unique: true },
  username: { type: String, unique: true },
  password: { type: String },
  firstName: { type: String },
  lastName: { type: String },
});

module.exports = mongoose.model("User", userSchema);
