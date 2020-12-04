import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const Schema = mongoose.Schema;

const driverSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 2
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 5
    }
}, {
    timestamps: true
});

driverSchema.methods.generateAuthToken = () => {
    const token = jwt.sign(
        // @ts-ignore
        { _id1: this._id, name1: this.name },
        process.env.JWT_PRIVATE_KEY,
        { expiresIn: '7d' }
    );

    return token;
};

const Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver;