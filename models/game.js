const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const gameSchema = new Schema({
    player: {type: String},
    matrix: {type: Array},
    status: {type: String},
});

module.exports = mongoose.model('game', gameSchema);