const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB connected")
})

const lapsRouter = require('./routes/lap.router');
const tracksRouter = require('./routes/track.router');
const carsRouter = require('./routes/car.router');
const driversRouter = require('./routes/driver.router');

app.use('/laps', lapsRouter);
app.use('/tracks', tracksRouter);
app.use('/cars', carsRouter);
app.use('/drivers', driversRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});