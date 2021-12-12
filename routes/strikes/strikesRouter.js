const express = require("express");
const router = express.Router();

const { newStrike, resetStrikes } = require("./controller/strikesController");

router.put("/new", newStrike);
router.put("/reset", resetStrikes);

module.exports = router;
