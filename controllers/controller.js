const gameModel = require('../models/game');
const async = require('async');

exports.player = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    async.series({
        found: (callback) => {
            gameModel.find({}, callback);
        }
    }, (err, results) => {
        if (err) {
            console.log(err);
        }
        else {
            if (results) {
                if (results.found[0]) {
                    if (!results.found[0].playerx) {
                        res.json({player: 'x'});
                        gameModel.findOneAndUpdate(
                            {}, 
                            {'$set': {'playerx': true}}, 
                            {upsert: true}, 
                            (err) => {
                                if (err) console.log(err);
                            }
                        );
                    }
                    else if (!results.found[0].playero) {
                        res.json({player: 'o'});
                        gameModel.findOneAndUpdate(
                            {}, 
                            {'$set': {'playero': true}}, 
                            {upsert: true}, 
                            (err) => {
                                if (err) console.log(err);
                            }
                        );
                    }
                    else {
                        // Both players have started.
                        res.json({player: ''});
                    }
                }
            }
        }
    });
};

exports.store = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    async.series({
        upsert: () => {
            const game = {
                player: req.body.player,
                matrix: req.body.matrix,
                status: req.body.status,
            };
            gameModel.findOneAndUpdate(
                {}, 
                {'$set': game}, 
                {upsert: true}, 
                (err, results) => {
                    if (err) {
                        res.send(err);
                    } else {
                        res.send(results);
                    }
                }
            );
        } 
    }, (err) => {
        if (err) throw err;
    });
};
 
exports.retrieve = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    async.series({
        found: (callback) => {
            gameModel.find({}, callback);
        }
    }, (err, results) => {
        if (err) {
            console.log(err);
        }
        else {
            if (results) {
                if (results.found[0]) {
                    let player = 'x';
                    if (results.found[0].status === 'ongoing') {
                        player = results.found[0].player === 'x' ? 'o' : 'x';
                    }
                    const cookie = ['player=' + player];
                    res.setHeader('Set-Cookie', cookie);
                    res.json(results.found[0]);
                }
                else {
                    // No documents in mongo collection: create one. Use upsert in order to prevent double documents.
                    const game = {
                        player: 'x',
                        playerx: false,
                        playery: false,
                        matrix: [],
                        status: 'new',
                    };
                    gameModel.findOneAndUpdate(
                        {}, 
                        {'$set': game}, 
                        {upsert: true}, 
                        (err, results) => {
                            if (err) {
                                res.send(err);
                            } else {
                                res.send(results);
                            }
                        }
                    );
                }
            }
        }
    });
};

exports.reset = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    gameModel.deleteMany(
        {}, 
        (err, results) => {
            if (err) {
                res.send(err);
            } else {
                res.send(results);
            }
        }
    );
}