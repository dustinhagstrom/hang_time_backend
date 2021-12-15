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
  const { gameID } = req.body;
  const { newWord } = res.locals;
  console.log("pusherAddCorrect: ", newWord);
  try {
    pusher.trigger(gameID, "correctLetterEvent", {
      payload: newWord,
    });
  } catch (e) {
    next(e);
  }
};

const pusherAddIncorrectLetters = async (req, res, next) => {
  const { gameID } = req.body;
  const { wordBank } = res.locals;
  console.log(wordBank);

  try {
    pusher.trigger(gameID, "incorrectLetterEvent", {
      payload: wordBank,
    });
  } catch (e) {
    next(e);
  }
};

const pusherAddStrikes = async (req, res, next) => {
  const { strikes, gameID } = req.body;

  try {
    pusher.trigger(gameID, "incorrectLetterEvent", {
      payload: { strikes },
    });
  } catch (e) {
    next(e);
  }
};

const pusherGameOver = async (req, res, next) => {
  const { gameID } = req.body;
  const { wordBank } = res.locals;
  try {
    pusher.trigger(gameID, "gameOverNewWordEvent", {
      payload: wordBank,
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  pusherAddPlayerTwo,
  pusherAddCorrectLetters,
  pusherAddIncorrectLetters,
  pusherAddStrikes,
  pusherGameOver,
};
