const router = require('express').Router();

let Track = require('../models/track.model');

router.route('/').get((req, res) => {
    Track.find().collation({locale:'en', strength: 2}).sort({name: 1})
        .then(tracks => res.json(tracks))
        .catch(err => res.status(400).json('Error [Get All Tracks]: ' + err));
});

router.route('/:id').get((req, res) => {
    Track.findById(req.params.id)
        .then(track => res.json(track))
        .catch(err => res.status(400).json('Error [Get Track]: ' + err));
});

router.route('/add').post((req, res) => {
    const name = req.body.name;

    const newTrack = new Track({ name });

    newTrack.save()
        .then(track => res.json(track))
        .catch(err => res.status(400).json('Error [Add Track]: ' + err))
});

router.route('/edit/:id').post((req, res) => {
    Track.findById(req.params.id)
        .then(existingTrack => {
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