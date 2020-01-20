const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const playerSchema = new Schema({
  name: String,
  winnings: Number,
  gamesPlayed: [String],
  gamesWon: [String]
});

module.exports = mongoose.model('Player', playerSchema);
