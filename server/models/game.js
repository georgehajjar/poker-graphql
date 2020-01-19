const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameSchema = new Schema({
  name: String,
  prizeMoney: Number,
  winnerId: String
});

module.exports = mongoose.model('Game', gameSchema);
