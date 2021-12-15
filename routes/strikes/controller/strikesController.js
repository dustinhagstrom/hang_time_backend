const Strikes = require("../model/Strikes");
const Word = require("../../word/model/Word");

const { pusherAddStrikes } = require("../../utils/pusher");

const newStrike = async (req, res, next) => {
  const { strikes, gameID } = req.body;

  try {
    let foundWord = await Word.findOne({ gameID });

    foundWord.strikes = strikes;

    await foundWord.save(() => {
      pusherAddStrikes(req, res, next);
    });
    res.json({ message: "strikes updated." });
  } catch (e) {
    next(e);
  }
};
const resetStrikes = async (req, res, next) => {};

module.exports = {
  newStrike,
  resetStrikes,
};
