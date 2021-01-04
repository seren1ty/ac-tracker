const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const trackSchema = new Schema({
    game: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    }
}, {
    timestamps: true
});

const Track = mongoose.model('Track', trackSchema);

module.exports = Track;