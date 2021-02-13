const router = require('express').Router();

let Game = require('../models/game.model');
let Lap = require('../models/lap.model');

router.route('/').get((req, res) => {
    Game.find().collation({locale:'en', strength: 2}).sort({name: 1})
        .then(games => res.json(games))
        .catch(err => res.status(400).json('Error [Get All Games]: ' + err));
});

router.route('/lapCheck').get((req, res) => {
    Game.find().collation({locale:'en', strength: 2})
        .then(games => {
            let newGames = [];

            games.forEach(game => {
                Lap.exists({ game: game.name }, (err, result) => {
                    game._doc.hasLaps = result;
                    newGames.push(game);

                    if (newGames.length === games.length) {
                        newGames.sort((a,b) => {
                            return (a._doc.name > b._doc.name) ? 1 : ((b._doc.name > a._doc.name) ? -1 : 0);
                        });

                        res.json(newGames);
                    }
                });
            });
        })
        .catch(err => res.status(400).json('Error [Get All Tracks For Game]: ' + err));
});

router.route('/:id').get((req, res) => {
    Game.findById(req.params.id)
        .then(game => res.json(game))
        .catch(err => res.status(400).json('Error [Get Game]: ' + err));
});

router.route('/add').post((req, res) => {
    const name = req.body.name;

    const newGame = new Game({ name });

    newGame.save()
        .then(game => res.json(game))
        .catch(err => res.status(400).json('Error [Add Game]: ' + err))
});

router.route('/edit/:id').post((req, res) => {
    Game.findById(req.params.id)
        .then(existingGame => {
            existingGame.name = req.body.name;

            existingGame.save()
                .then(game => res.json(game))
                .catch((err) => res.status(400).json('Error [Edit Game]: ' + err));
        })
});

router.route('/delete/:id').delete((req, res) => {
    Game.findByIdAndDelete(req.params.id)
        .then(game => res.json(game))
        .catch(err => res.status(400).json('Error [Delete Game]: ' + err));
});

module.exports = router;