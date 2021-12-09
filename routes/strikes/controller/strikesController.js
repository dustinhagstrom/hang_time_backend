const Pusher = require("pusher");

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: "us2",
  useTLS: true,
});

const getStrikes = async (req, res) => {};
const newStrike = async (req, res) => {
  pusher.trigger("hangChannel", "hangEvent", {
    strikes: 1,
  });

  return res.json({
    success: true,
    message: "That is not a letter in our word!",
  });
};
const resetStrikes = async (req, res) => {};

module.exports = {
  getStrikes,
  newStrike,
  resetStrikes,
};
