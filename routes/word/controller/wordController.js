const Word = require("../model/Word");
const User = require("../../user/model/User");

const {
  pusherAddPlayerTwo,
  pusherAddCorrectLetters,
  pusherAddIncorrectLetters,
} = require("../../utils/pusher");

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

const addPlayerTwoDataToWord = async (req, res, next) => {
  const { email, gameID } = req.body;

  try {
    let foundPlayerTwo = await User.findOne({ email: email });
    let foundWord = await Word.findOne({ gameID });
    let foundPlayerOne = await User.findOne({
      _id: foundWord.playerOne,
    }).select("-__v -_id -password -firstName -lastName");

    res.locals.playerTwo = {
      email: foundPlayerTwo.email,
      username: foundPlayerTwo.username,
    };

    foundWord.playerTwo = foundPlayerTwo._id;
    await foundWord.save(() => {
      pusherAddPlayerTwo(req, res, next);
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

const addCorrectLettersToWord = async (req, res, next) => {
  const { correctLetters, emptyLetters, gameID } = req.body;
  try {
    let foundWord = await Word.findOne({ gameID });

    foundWord.correctLetters.push(correctLetters);
    foundWord.emptyLetters = emptyLetters;

    await foundWord.save(() => {
      pusherAddCorrectLetters(req, res, next);
    });
    res.json({ message: "updates saved." });
  } catch (e) {
    next(e);
  }
};

const addIncorrectLettersToWord = async (req, res, next) => {
  const { incorrectLetters, gameID } = req.body;

  try {
    let foundWord = await Word.findOne({ gameID });

    foundWord.incorrectLetters.push(incorrectLetters);

    await foundWord.save(() => {
      pusherAddIncorrectLetters(req, res, next);
    });
    res.json({ message: "updates saved." });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  newWord,
  addPlayerTwoDataToWord,
  addCorrectLettersToWord,
  addIncorrectLettersToWord,
};
