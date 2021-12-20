const express = require("express");
const router = express.Router();

const {
  newWord,
  addPlayerTwoDataToWord,
  updateWordOnPlayerTwoGuess,
  editWordOnGameOver,
  deleteWordOnGameOver,
} = require("./controller/wordController");

const { checkIsAlpha } = require("../utils/authMethods");

const checkIsUndefined = require("../user/helpers/checkIsUndefined");

const checkIsAlphaFunc = (req, res, next) => {
  const wordBank = req.body;
  // console.log("inside middleware :", wordBank);
  for (inputField in wordBank) {
    if (inputField === "word") {
      if (!checkIsAlpha(wordBank[inputField])) {
        errorObj[
          `${inputField}`
        ] = `${inputField} can only have letter characters.`;
      }
    }
  }
  next();
};

router.post("/new", checkIsUndefined, checkIsAlphaFunc, newWord);
router.put("/playerTwo", addPlayerTwoDataToWord);
router.put("/guess", updateWordOnPlayerTwoGuess);
router.put("/gameOver", checkIsUndefined, checkIsAlphaFunc, editWordOnGameOver);
router.delete("/endSession", deleteWordOnGameOver);

module.exports = router;
