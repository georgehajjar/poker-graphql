const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameSchema = new Schema({
  id: Number,
  name: String,
  prizeMoney: Number,
  winner: String
});

module.exports = mongoose.model('Game', gameSchema);
