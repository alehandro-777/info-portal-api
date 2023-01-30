const SeasonsCollection = require('../models/season');
const oparyStats = require('./seasons-stat-opary');

async function create (seasonId) {

    let result = {};
    let season = await SeasonsCollection.findById(seasonId).exec();

    if (season.object == 906021) {
        result = await oparyStats.create(season);
        return result;
    }


    return result;
}



exports.create = create;
