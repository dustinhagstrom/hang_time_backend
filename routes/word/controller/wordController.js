const Word = require("../model/Word");
const User = require("../../user/model/User");

const {
  pusherAddPlayerTwo,
  pusherAddCorrectLetters,
  pusherAddIncorrectLetters,
  pusherGameOver,
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
          strikes: foundWord.strikes,
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

    // foundWord.correctLetters = correctLetters;
    foundWord.emptyLetters = emptyLetters;
    let correctArray = foundWord.correctLetters;
    correctArray.push(correctLetters);
    foundWord.correctLetters = correctArray;

    let newWord = {
      word: foundWord.word,
      emptyLetters: foundWord.emptyLetters,
      correctLetters: foundWord.correctLetters,
      incorrectLetters: foundWord.incorrectLetters,
      gameID: foundWord.gameID,
      strikes: foundWord.strikes,
      playerOne: foundWord.playerOne,
      playerTwo: foundWord.playerTwo,
    };

    res.locals.newWord = newWord;

    await foundWord.save(() => {
      pusherAddCorrectLetters(req, res, next);
    });
    res.json({
      wordBank: newWord,
    });
  } catch (e) {
    next(e);
  }
};

const addIncorrectLettersToWord = async (req, res, next) => {
  const { incorrectLetters, gameID, strikes } = req.body;
  console.log("line 133: ", incorrectLetters, gameID, strikes);
  try {
    let foundWord = await Word.findOne({ gameID });
    foundWord.strikes = strikes;
    // foundWord.incorrectLetters = incorrectLetters;
    let incorrectArray = foundWord.incorrectLetters;
    incorrectArray.push(incorrectLetters);
    foundWord.incorrectLetters = incorrectArray;

    let wordBank = {
      word: foundWord.word,
      emptyLetters: foundWord.emptyLetters,
      correctLetters: foundWord.correctLetters,
      incorrectLetters: foundWord.incorrectLetters,
      gameID: foundWord.gameID,
      strikes: foundWord.strikes,
      playerOne: foundWord.playerOne,
      playerTwo: foundWord.playerTwo,
    };

    res.locals.wordBank = wordBank;

    await foundWord.save(() => {
      pusherAddIncorrectLetters(req, res, next);
    });
    res.json({ wordBank });
  } catch (e) {
    next(e);
  }
};

const editWordOnGameOver = async (req, res, next) => {
  const { word, emptyLetters, gameID } = req.body;

  try {
    let foundWord = await Word.findOne({ gameID });

    foundWord.emptyLetters = emptyLetters;
    foundWord.word = word;
    foundWord.correctLetters = [];
    foundWord.incorrectLetters = [];
    foundWord.strikes = 0;
    console.log(foundWord);

    const wordBank = {
      word,
      emptyLetters,
      correctLetters: [],
      incorrectLetters: [],
      gameID,
      strikes: 0,
    };
    res.locals.wordBank = wordBank;

    await foundWord.save(() => {
      pusherGameOver(req, res, next);
    });
    res.json({ message: "new game.", payload: wordBank });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  newWord,
  addPlayerTwoDataToWord,
  addCorrectLettersToWord,
  addIncorrectLettersToWord,
  editWordOnGameOver,
};
