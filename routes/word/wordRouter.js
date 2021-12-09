const express = require("express");
const router = express.Router();

const { getWord, newWord, editWord } = require("./controller/wordController");

router.get("/", getWord);
router.put("/new", newWord);
router.put("/edit", editWord);

module.exports = router;
