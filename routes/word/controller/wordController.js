const Pusher = require("pusher");

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: "us2",
  useTLS: true,
});

const Word = require("../model/Word");
const User = require("../../user/model/User");

const newWord = async (req, res, next) => {
  const { word, emptyLetters, userEmail } = req.body;
  try {
    let foundUser = await User.findOne({ email: userEmail });

    console.log(foundUser._id);

    const generateRandomGameID = () => {
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

      let gameArray = [];
      for (let i = 0; i < 4; i++) {
        const randomNum = Math.floor(Math.random() * alphabet.length);
        gameArray.push(alphabet[randomNum]);
      }
      let joinedArray = gameArray.join("");
      return joinedArray;
    };

    const gameID = generateRandomGameID();

    const newWordToDB = new Word({
      word,
      emptyLetters,
      correctLetters: [],
      incorrectLetters: [],
      gameID: gameID,
      playerOne: foundUser._id,
    });

    await newWordToDB.save();

    res.json({
      message: "Word is Accepted.",
      payload: {
        word: newWordToDB.word,
        emptyLetters: newWordToDB.emptyLetters,
        correctLetters: newWordToDB.correctLetters,
        incorrectLetters: newWordToDB.incorrectLetters,
        gameID: newWordToDB.gameID,
      },
    });
  } catch (e) {
    next(e);
  }
};

const pusherWord = async (req, res, next) => {
  const { sessionID } = req.body;
  const { playerTwo } = res.locals;
  console.log(playerTwo);
  console.log(sessionID);

  try {
    pusher.trigger(sessionID, "hangEvent", {
      payload: playerTwo,
    });
  } catch (e) {
    next(e);
  }
};

const addPlayerTwoDataToWord = async (req, res, next) => {
  const { email, sessionID } = req.body;
  console.log("email: ", email);
  console.log("sessionID: ", sessionID);

  try {
    let foundPlayerTwo = await User.findOne({ email: email });
    let foundWord = await Word.findOne({ gameID: sessionID });
    let foundPlayerOne = await User.findOne({
      _id: foundWord.playerOne,
    }).select("-__v -_id -password -firstName -lastName");

    res.locals.playerTwo = {
      email: foundPlayerTwo.email,
      username: foundPlayerTwo.username,
    };

    foundWord.playerTwo = foundPlayerTwo._id;
    await foundWord.save(() => {
      pusherWord(req, res, next);
    });

    res.json({
      message: "player two data added to word data.",
      payload: {
        foundPlayerOne,
        gameWord: {
          word: foundWord.word,
          emptyLetters: foundWord.emptyLetters,
          correctLetters: foundWord.correctLetters,
          incorrectLetters: foundWord.incorrectLetters,
          gameID: foundWord.gameID,
        },
      },
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  newWord,
  addPlayerTwoDataToWord,
};
