const newStrike = async (req, res) => {
  return res.json({
    success: true,
    message: "That is not a letter in our word!",
  });
};
const resetStrikes = async (req, res) => {};

module.exports = {
  newStrike,
  resetStrikes,
};
