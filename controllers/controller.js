const gameModel = require('../models/game');

exports.store = async (req, res, next) => {
    console.log('controller');
    gameModel.deleteMany({}, (err) => {
        if (err) throw err;
    })
    .then(async () => {
        const gameInstance = new gameModel({
            player: 'o',
            matrix: [['4','5','6'], ['7','8','9']]
        });
        gameInstance.save((err) => {
            if (err) return handleError(err);
            console.log('doc stored');
            return;
        });
    });
};
 
exports.retrieve = async (req, res, next) => {
    console.log('retr');
    gameModel.find({}).exec((err, game) => {
        console.log('in');
        if (err) {
            console.log(err);
            return next(err)
        };
        console.log(game);
    });
};