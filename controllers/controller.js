const gameModel = require('../models/game');
const async = require('async');

exports.store = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    async.series({
        delete: (callback) => {
            gameModel.deleteMany({}, callback);
        },
        create: () => {
            const gameInstance = new gameModel({
                player: req.body.player,
                matrix: req.body.matrix
            });
            gameInstance.save((err) => {
                if (err) {
                    console.log(err);
                    return handleError(err);
                }
            });
        } 
    }, (err) => {
        if (err) throw err;
    });
    res.send('ok');
};
 
exports.retrieve = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    async.series({
        found: (callback) => {
            gameModel.find({}, callback);
        }
    }, (err, results) => {
        res.json(results.found[0]);
    });
};