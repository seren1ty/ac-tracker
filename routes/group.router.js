const router = require('express').Router();

let Group = require('../models/group.model');

router.route('/').get((req, res) => {
    Group.find().collation({locale:'en', strength: 2}).sort({name: 1})
         .then(groups => res.json(groups))
         .catch(err => res.status(400).json('Error [Get All Groups]: ' + err));
});

router.route('/:id').get((req, res) => {
    Group.findById(req.params.id)
        .then(group => res.json(group))
        .catch(err => res.status(400).json('Error [Get Group]: ' + err));
});

router.route('/add').post((req, res) => {
    const name = req.body.name;
    const code = req.body.code;
    const description = req.body.description;
    const ownerId = req.body.ownerId;

    const newGroup = new Group({ name, code, description, ownerId });

    newGroup.save()
        .then(group => res.json(group))
        .catch(err => res.status(400).json('Error [Add Group]: ' + err))
});

router.route('/edit/:id').put((req, res) => {
    Group.findById(req.params.id)
        .then(existingGroup => {
            existingGroup.name = req.body.name;
            existingGroup.code = req.body.code;
            existingGroup.description = req.body.description;
            existingGroup.adminId = req.body.ownerId;

            existingGroup.save()
                .then(group => res.json(group))
                .catch((err) => res.status(400).json('Error [Edit Group]: ' + err));
        })
});

router.route('/delete/:id').delete((req, res) => {
    Group.findByIdAndDelete(req.params.id)
        .then(group => res.json(group))
        .catch(err => res.status(400).json('Error [Delete Group]: ' + err));
});

module.exports = router;