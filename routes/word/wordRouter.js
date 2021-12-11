const express = require("express");
const router = express.Router();

const {
  newWord,
  addPlayerTwoDataToWord,
} = require("./controller/wordController");

router.post("/new", newWord);

router.put("/playerTwo", addPlayerTwoDataToWord);

module.exports = router;
