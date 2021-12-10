const Word = require("../model/Word");

const newWord = async (req, res, next) => {
  const { word, emptyLetters } = req.body;

  try {
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
    });

    await newWordToDB.save();

    res.json({
      message: "Word is Accepted.",
      payload: newWordToDB,
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  newWord,
};
