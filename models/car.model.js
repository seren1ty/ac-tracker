const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const carSchema = new Schema({
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

const Car = mongoose.model('Car', carSchema);

module.exports = Car;