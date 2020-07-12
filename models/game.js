const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const gameSchema = new Schema({
    player: {type: String},                     // this is the player that has made the last move
    playerx: {type: Boolean, default: false},   // when a browser connects for the first time this one tells if the player x was already assigned
    playero: {type: Boolean, default: false},   // when a browser connects for the first time this one tells if the player o was already assigned
    matrix: {type: Array},
    status: {type: String},                     // can be "new", "ongoing", "over"
});

module.exports = mongoose.model('game', gameSchema);