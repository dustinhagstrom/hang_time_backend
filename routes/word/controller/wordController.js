const Word = require("../model/Word");
const User = require("../../user/model/User");

const {
  pusherAddPlayerTwo,
  pusherGameOver,
  pusherPlayerTwoGuess,
  pusherEndSession,
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
      strikes: 0,
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
        strikes: newWordToDB.strikes,
      },
    });
  } catch (e) {
    next(e);
  }
};

const addPlayerTwoDataToWord = async (req, res, next) => {
  const { email, gameID } = req.body;
  console.log(gameID);
  const gameIDUpperCase = gameID.toUpperCase();

  try {
    let foundPlayerTwo = await User.findOne({ email: email });
    let foundWord = await Word.findOne({ gameID: gameIDUpperCase });
    let foundPlayerOne = await User.findById({
      _id: foundWord.playerOne,
    }).select("-__v -_id -password -firstName -lastName");

    res.locals.playerTwo = {
      email: foundPlayerTwo.email,
      username: foundPlayerTwo.username,
    };

    res.locals.gameID = gameIDUpperCase;

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
          strikes: foundWord.strikes,
        },
      },
    });
  } catch (e) {
    next(e);
  }
};

const updateWordOnPlayerTwoGuess = async (req, res, next) => {
  console.log(req.body);
  let newWordBank = req.body;
  const { gameID, emptyLetters, correctLetters, incorrectLetters, strikes } =
    newWordBank;
  try {
    let foundWord = await Word.findOne({ gameID });

    foundWord.emptyLetters = emptyLetters;
    foundWord.correctLetters = correctLetters;
    foundWord.incorrectLetters = incorrectLetters;
    foundWord.strikes = strikes;

    let wordBank = {
      word: foundWord.word,
      emptyLetters,
      correctLetters,
      incorrectLetters,
      gameID,
      strikes,
      playerOne: foundWord.playerOne,
      playerTwo: foundWord.playerTwo,
    };

    res.locals.wordBank = wordBank;

    await foundWord.save(() => {
      pusherPlayerTwoGuess(req, res, next);
    });
    res.json({
      message: "p2 guesses updated",
      wordBank,
    });
  } catch (e) {
    next(e);
  }
};

const editWordOnGameOver = async (req, res, next) => {
  const { emptyLetters, word, gameID } = req.body;
  console.log("req.body :", req.body);
  try {
    let wordBank = await Word.findOne({ gameID });

    wordBank.emptyLetters = emptyLetters;
    wordBank.word = word;
    wordBank.correctLetters = [];
    wordBank.incorrectLetters = [];
    wordBank.strikes = 0;
    console.log(wordBank);

    res.locals = { wordBank, gameID };

    await wordBank.save(() => {
      pusherGameOver(req, res, next);
    });
    res.json({
      message: "new game.",
      payload: wordBank,
    });
  } catch (e) {
    next(e);
  }
};

const deleteWordOnGameOver = async (req, res, next) => {
  console.log(req.body);
  const { gameID } = req.body;
  try {
    await Word.findOneAndDelete({ gameID });

    pusherEndSession(req, res, next);

    res.json({ message: "word deleted." });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  newWord,
  addPlayerTwoDataToWord,
  updateWordOnPlayerTwoGuess,
  editWordOnGameOver,
  deleteWordOnGameOver,
};
