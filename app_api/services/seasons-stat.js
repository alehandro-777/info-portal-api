const SeasonsCollection = require('../models/season');
const oparyStats = require('./seasons-stat-opary');
const dashavaStats = require('./seasons-stat-dashava');
const bogorodchanyStats = require('./seasons-stat-bogorodchany');
const ugerskeStats = require('./seasons-stat-ugerske');
const mrynStats = require('./seasons-stat-mryn');
const proletarskeStats = require('./seasons-stat-proletarske');
const bvuStats = require('./seasons-stat-bvu');
const kegichivkaStats = require('./seasons-stat-kegichivka');
const soloxaStats = require('./seasons-stat-soloxa');
const olyshivkaStats = require('./seasons-stat-olyshivka');
const krasnopopivskeStats = require('./seasons-stat-krasnopopivske');


async function create (seasonId) {

    let result = {};
    let season = await SeasonsCollection.findById(seasonId).exec();

    if (season.object == 906021) {
        result = await oparyStats.create(season);
        return result;
    }
    if (season.object == 906022) {
        result = await dashavaStats.create(season);
        return result;
    }
    if (season.object == 903031) {
        result = await bogorodchanyStats.create(season);
        return result;
    }
    if (season.object == 906023) {
        result = await ugerskeStats.create(season);
        return result;
    }
    if (season.object == 901032) {
        result = await mrynStats.create(season);
        return result;
    }
    if (season.object == 902031) {
        result = await proletarskeStats.create(season);
        return result;
    }
    if (season.object == 906024) {
        result = await bvuStats.create(season);
        return result;
    }
    if (season.object == 902032) {
        result = await kegichivkaStats.create(season);
        return result;
    }
    if (season.object == 901031) {
        result = await soloxaStats.create(season);
        return result;
    }
    if (season.object == 901033) {
        result = await olyshivkaStats.create(season);
        return result;
    }
    if (season.object == 905031) {
        result = await krasnopopivskeStats.create(season);
        return result;
    }



    return result;
}



exports.create = create;
