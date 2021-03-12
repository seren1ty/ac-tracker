const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const groupSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 2
    },
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 2
    },
    description: {
        type: String
    },
    ownerId: {
        type: String
    }
}, {
    timestamps: true
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;