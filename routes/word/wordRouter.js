const express = require("express");
const router = express.Router();

const {
  getWord,
  newWord,
  deleteWord,
  editWord,
} = require("./controller/wordController");

router.get("/", getWord);
router.post("/new", newWord);
router.delete("/delete", deleteWord);
router.put("/edit", editWord);

module.exports = router;
