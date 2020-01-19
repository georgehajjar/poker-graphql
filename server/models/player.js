const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playerSchema = new Schema({
  name: String,
  winnings: Number,
  played: [Number]
});

module.exports = mongoose.model('Player', playerSchema);