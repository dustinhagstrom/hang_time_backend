const express = require("express");
const router = express.Router();

const {
  newWord,
  addPlayerTwoDataToWord,
  addCorrectLettersToWord,
  addIncorrectLettersToWord,
  editWordOnGameOver,
} = require("./controller/wordController");

router.post("/new", newWord);
router.put("/playerTwo", addPlayerTwoDataToWord);
router.put("/correct", addCorrectLettersToWord);
router.put("/incorrect", addIncorrectLettersToWord);
router.put("/gameOver", editWordOnGameOver);

module.exports = router;
