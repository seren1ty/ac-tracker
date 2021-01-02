const router = require('express').Router();

let Lap = require('../models/lap.model');

router.route('/').get((req, res) => {
    Lap.find()
        .then(laps => res.json(laps))
        .catch(err => res.status(400).json('Error [Get All Laps]: ' + err));
});

router.route('/:id').get((req, res) => {
    Lap.findById(req.params.id)
        .then(lap => res.json(lap))
        .catch(err => res.status(400).json('Error [Get Lap]: ' + err));
});

router.route('/add').post((req, res) => {
    // TODO Replace with req value once UI implemented
    const game = 'Assetto Corsa';
    const track = req.body.track;
    const car = req.body.car;
    const laptime = req.body.laptime;
    const driver = req.body.driver;
    const gearbox = req.body.gearbox;
    const traction = req.body.traction;
    const stability = req.body.stability;
    const replay = req.body.replay;
    const notes = req.body.notes;
    const date = Date.parse(req.body.date);

    const newLap = new Lap({
        game,
        track,
        car,
        laptime,
        driver,
        gearbox,
        traction,
        stability,
        replay,
        notes,
        date
    });

    newLap.save()
        .then(lap => res.json(lap))
        .catch(err => res.status(400).json('Error [Add Lap]: ' + err))
});

router.route('/edit/:id').post((req, res) => {
    Lap.findById(req.params.id)
        .then(existingLap => {
            existingLap.game = req.body.game;
            existingLap.track = req.body.track;
            existingLap.car = req.body.car;
            existingLap.laptime = req.body.laptime;
            existingLap.driver = req.body.driver;
            existingLap.gearbox = req.body.gearbox;
            existingLap.traction = req.body.traction;
            existingLap.stability = req.body.stability;
            existingLap.replay = req.body.replay;
            existingLap.notes = req.body.notes;
            existingLap.date = Date.parse(req.body.date);

            existingLap.save()
                .then(lap => res.json(lap))
                .catch((err) => res.status(400).json('Error [Edit Lap]: ' + err));
        })
});

router.route('/delete/:id').delete((req, res) => {
    Lap.findByIdAndDelete(req.params.id)
        .then(lap => res.json(lap))
        .catch(err => res.status(400).json('Error [Delete Lap]: ' + err));
});

module.exports = router;