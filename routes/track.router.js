const router = require('express').Router();

let Track = require('../models/track.model');
let Lap = require('../models/lap.model');

router.route('/').get((req, res) => {
    Track.find().collation({locale:'en', strength: 2}).sort({name: 1})
        .then(tracks => res.json(tracks))
        .catch(err => res.status(400).json('Error [Get All Tracks]: ' + err));
});

router.route('/:game').get((req, res) => {
    Track.find({ game: req.params.game }).collation({locale:'en', strength: 2}).sort({name: 1})
        .then(tracks => res.json(tracks))
        .catch(err => res.status(400).json('Error [Get All Tracks For Game]: ' + err));
});

router.route('/lapCheck/:game').get((req, res) => {
    Track.find({ game: req.params.game }).collation({locale:'en', strength: 2})
        .then(tracks => {
            let newTracks = [];

            tracks.forEach(track => {
                Lap.exists({ track: track.name }, (err, result) => {
                    track._doc.hasLaps = result;
                    newTracks.push(track);

                    if (newTracks.length === tracks.length) {
                        newTracks.sort((a,b) => {
                            return (a._doc.name > b._doc.name) ? 1 : ((b._doc.name > a._doc.name) ? -1 : 0);
                        });

                        res.json(newTracks);
                    }
                });
            });
        })
        .catch(err => res.status(400).json('Error [Get All Tracks For Game]: ' + err));
});

router.route('/one/:id').get((req, res) => {
    Track.findById(req.params.id)
        .then(track => res.json(track))
        .catch(err => res.status(400).json('Error [Get Track]: ' + err));
});

router.route('/add').post((req, res) => {
    const game = req.body.game;
    const name = req.body.name;

    const newTrack = new Track({ game, name });

    newTrack.save()
        .then(track => res.json(track))
        .catch(err => res.status(400).json('Error [Add Track]: ' + err))
});

router.route('/edit/:id').put((req, res) => {
    Track.findById(req.params.id)
        .then(existingTrack => {
            existingTrack.game = req.body.game;
            existingTrack.name = req.body.name;

            existingTrack.save()
                .then(track => res.json(track))
                .catch((err) => res.status(400).json('Error [Edit Track]: ' + err));
        })
});

router.route('/delete/:id').delete((req, res) => {
    Track.findByIdAndDelete(req.params.id)
        .then(track => res.json(track))
        .catch(err => res.status(400).json('Error [Delete Track]: ' + err));
});

module.exports = router;