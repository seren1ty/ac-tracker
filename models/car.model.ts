import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const carSchema = new Schema({
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

const Car = mongoose.model('Car', carSchema);

module.exports = Car;