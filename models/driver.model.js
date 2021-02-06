const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

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
    },
    isAdmin: {
        type: Boolean
    }
}, {
    timestamps: true
});

driverSchema.methods.generateAuthToken = () => {
    const token = jwt.sign(
        {
            _id: this._id,
            name: this.name
        },
        process.env.JWT_PRIVATE_KEY,
        { expiresIn: '7d' }
    );

    return token;
};

const Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver;