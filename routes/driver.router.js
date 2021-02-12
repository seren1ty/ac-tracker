const router = require('express').Router();

let Driver = require('../models/driver.model');
let Lap = require('../models/lap.model');

router.route('/').get((req, res) => {
    Driver.find().collation({locale:'en', strength: 2}).sort({name: 1})
        .then(drivers => res.json(drivers))
        .catch(err => res.status(400).json('Error [Get All Drivers]: ' + err));
});

router.route('/lapCheck').get((req, res) => {
    Driver.find().collation({locale:'en', strength: 2}).sort({name: 1})
        .then(drivers => {
            let newDrivers = [];

            drivers.forEach(driver => {
                Lap.exists({ driver: driver.name }, (err, result) => {
                    driver._doc.hasLaps = result;
                    newDrivers.push(driver);

                    if (newDrivers.length === drivers.length)
                        res.json(newDrivers);
                });
            });
        })
        .catch(err => res.status(400).json('Error [Get All Tracks For Game]: ' + err));
});

router.route('/:id').get((req, res) => {
    Driver.findById(req.params.id)
        .then(driver => res.json(driver))
        .catch(err => res.status(400).json('Error [Get Driver]: ' + err));
});

router.route('/add').post((req, res) => {
    const name = req.body.name;

    const newDriver = new Driver({ name });

    newDriver.save()
        .then(driver => res.json(driver))
        .catch(err => res.status(400).json('Error [Add Driver]: ' + err))
});

router.route('/edit/:id').post((req, res) => {
    Driver.findById(req.params.id)
        .then(existingDriver => {
            existingDriver.name = req.body.name;

            existingDriver.save()
                .then(driver => res.json(driver))
                .catch((err) => res.status(400).json('Error [Edit Driver]: ' + err));
        })
});

router.route('/delete/:id').delete((req, res) => {
    Driver.findByIdAndDelete(req.params.id)
        .then(driver => res.json(driver))
        .catch(err => res.status(400).json('Error [Delete Driver]: ' + err));
});

module.exports = router;