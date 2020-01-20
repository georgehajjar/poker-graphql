const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const gameSchema = new Schema({
  gameId: String,
  name: String,
  prizeMoney: Number
});

module.exports = mongoose.model('Game', gameSchema);
