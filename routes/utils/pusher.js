const Pusher = require("pusher");

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: "us2",
  useTLS: true,
});

const pusherAddPlayerTwo = async (req, res, next) => {
  // const { gameID } = req.body;
  const { playerTwo, gameID } = res.locals;

  try {
    pusher.trigger(gameID, "P2joinEvent", {
      payload: playerTwo,
    });
  } catch (e) {
    next(e);
  }
};

const pusherPlayerTwoGuess = async (req, res, next) => {
  const { gameID } = req.body;
  const { wordBank } = res.locals;

  try {
    pusher.trigger(gameID, "P2GuessEvent", {
      payload: wordBank,
    });
  } catch (e) {
    next(e);
  }
};

const pusherGameOver = async (req, res, next) => {
  const { wordBank, gameID } = res.locals;
  try {
    pusher.trigger(gameID, "gameOverNewWordEvent", {
      payload: wordBank,
    });
  } catch (e) {
    next(e);
  }
};

const pusherEndSession = async (req, res, next) => {
  const { gameID } = req.body;
  try {
    pusher.trigger(gameID, "EndSessionEvent", {
      payload: "end of game",
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  pusherAddPlayerTwo,
  pusherPlayerTwoGuess,
  pusherGameOver,
  pusherEndSession,
};
