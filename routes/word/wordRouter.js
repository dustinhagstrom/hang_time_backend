const express = require("express");
const router = express.Router();

const {
  newWord,
  addPlayerTwoDataToWord,
  addCorrectLettersToWord,
  addIncorrectLettersToWord,
} = require("./controller/wordController");

router.post("/new", newWord);
router.put("/playerTwo", addPlayerTwoDataToWord);
router.put("/correct", addCorrectLettersToWord);
router.put("/incorrect", addIncorrectLettersToWord);

module.exports = router;
