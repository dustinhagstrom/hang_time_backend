const express = require("express");
const router = express.Router();

const {
  getStrikes,
  newStrike,
  resetStrikes,
} = require("./controller/strikesController");

router.get("/", getStrikes);
router.put("/new", newStrike);
router.put("/reset", resetStrikes);

module.exports = router;
