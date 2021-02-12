const router = require('express').Router();

let Car = require('../models/car.model');
let Lap = require('../models/lap.model');

router.route('/').get((req, res) => {
    Car.find().collation({locale:'en', strength: 2}).sort({name: 1})
        .then(cars => res.json(cars))
        .catch(err => res.status(400).json('Error [Get All Cars]: ' + err));
});

router.route('/:game').get((req, res) => {
    Car.find({ game: req.params.game }).collation({locale:'en', strength: 2}).sort({name: 1})
        .then(cars => res.json(cars))
        .catch(err => res.status(400).json('Error [Get All Cars For Game]: ' + err));
});

router.route('/lapCheck/:game').get((req, res) => {
    Car.find({ game: req.params.game }).collation({locale:'en', strength: 2}).sort({name: 1})
        .then(cars => {
            let newCars = [];

            cars.forEach(car => {
                Lap.exists({ car: car.name }, (err, result) => {
                    car._doc.hasLaps = result;
                    newCars.push(car);

                    if (newCars.length === cars.length)
                        res.json(newCars);
                });
            });
        })
        .catch(err => res.status(400).json('Error [Get All Tracks For Game]: ' + err));
});

router.route('/one/:id').get((req, res) => {
    Car.findById(req.params.id)
        .then(car => res.json(car))
        .catch(err => res.status(400).json('Error [Get Car]: ' + err));
});

router.route('/add').post((req, res) => {
    const game = req.body.game;
    const name = req.body.name;

    const newCar = new Car({ game, name });

    newCar.save()
        .then(car => res.json(car))
        .catch(err => res.status(400).json('Error [Add Car]: ' + err))
});

router.route('/edit/:id').post((req, res) => {
    Car.findById(req.params.id)
        .then(existingCar => {
            existingCar.game = req.body.game;
            existingCar.name = req.body.name;

            existingCar.save()
                .then(car => res.json(car))
                .catch((err) => res.status(400).json('Error [Edit Car]: ' + err));
        })
});

router.route('/delete/:id').delete((req, res) => {
    Car.findByIdAndDelete(req.params.id)
        .then(car => res.json(car))
        .catch(err => res.status(400).json('Error [Delete Car]: ' + err));
});

module.exports = router;