const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const path = require('path');

require('dotenv').config();
require('./database/database');

const app = express();
const port = process.env.PORT || 5000;
const frontEndUrl = process.env.FRONT_END_URL || 'http://localhost:3000';

app.use(cors({ credentials: true, origin: frontEndUrl }));
app.use(express.json());
app.use(cookieParser());

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB connected")
})

const authCheck = require('./auth/authCheck');

const loginRouter = require('./routes/login.router');
const sessionRouter = require('./routes/session.router');
const lapsRouter = require('./routes/lap.router');
const tracksRouter = require('./routes/track.router');
const carsRouter = require('./routes/car.router');
const driversRouter = require('./routes/driver.router');

app.use('/login', loginRouter);
app.use('/session', sessionRouter);

//app.use(authCheck);

app.use('/laps', lapsRouter);
app.use('/tracks', tracksRouter);
app.use('/cars', carsRouter);
app.use('/drivers', driversRouter);

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'client/build', 'client/public/index.html'));
    });
}

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});