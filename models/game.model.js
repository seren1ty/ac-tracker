const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const gameSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 2
    }
}, {
    timestamps: true
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;