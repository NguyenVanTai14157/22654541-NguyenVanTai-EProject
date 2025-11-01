const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  pass: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("User", UserSchema);