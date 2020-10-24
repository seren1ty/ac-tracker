const mongoose = require('mongoose');

const connection = "mongodb+srv://dbUser:4QumvR9VF4rC4s@actrackercluster.ewugx.mongodb.net/ac_tracker?retryWrites=true&w=majority";

const uri = process.env.MONGODB_URI || connection;
mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});