const router = require('express').Router();

let Car = require('../models/car.model');

router.route('/').get((req, res) => {
    Car.find().collation({locale:'en', strength: 2}).sort({name: 1})
        .then(cars => res.json(cars))
        .catch(err => res.status(400).json('Error [Get All Cars]: ' + err));
});

router.route('/:id').get((req, res) => {
    Car.findById(req.params.id)
        .then(car => res.json(car))
        .catch(err => res.status(400).json('Error [Get Car]: ' + err));
});

router.route('/add').post((req, res) => {
    const name = req.body.name;

    const newCar = new Car({ name });

    newCar.save()
        .then(car => res.json(car))
        .catch(err => res.status(400).json('Error [Add Car]: ' + err))
});

router.route('/edit/:id').post((req, res) => {
    Car.findById(req.params.id)
        .then(existingCar => {
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