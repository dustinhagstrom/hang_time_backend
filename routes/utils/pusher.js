const Pusher = require("pusher");

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: "us2",
  useTLS: true,
});

const pusherAddPlayerTwo = async (req, res, next) => {
  const { gameID } = req.body;
  const { playerTwo } = res.locals;

  try {
    pusher.trigger(gameID, "P2joinEvent", {
      payload: playerTwo,
    });
  } catch (e) {
    next(e);
  }
};

const pusherAddCorrectLetters = async (req, res, next) => {
  const { correctLetters, emptyLetters, gameID } = req.body;

  try {
    pusher.trigger(gameID, "correctLetterEvent", {
      payload: { correctLetters, emptyLetters },
    });
  } catch (e) {
    next(e);
  }
};

const pusherAddIncorrectLetters = async (req, res, next) => {
  const { incorrectLetters, gameID } = req.body;

  try {
    pusher.trigger(gameID, "incorrectLetterEvent", {
      payload: { incorrectLetters },
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  pusherAddPlayerTwo,
  pusherAddCorrectLetters,
  pusherAddIncorrectLetters,
};
