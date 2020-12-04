import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const trackSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    }
}, {
    timestamps: true
});

const Track = mongoose.model('Track', trackSchema);

module.exports = Track;