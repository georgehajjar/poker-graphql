const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameSchema = new Schema({
  name: String,
  prizeMoney: Number,
  winnerId: Number
});

module.exports = mongoose.model('Game', gameSchema);
