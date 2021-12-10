const express = require("express");
const router = express.Router();

const { newWord } = require("./controller/wordController");

router.post("/new", newWord);

module.exports = router;
