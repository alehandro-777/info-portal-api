const SmartDate = require('../../smartdate');
const dataService = require('./data');

exports.selectOpData = async (gasday) => {
    let objects = [7000001,906023,906024,906035,906026,906022,906021,903031,901033,901032,901031,902031,902032,905031,
        6006037,6006036,9902293,9902294,611012,611013,611016,611017,611018,611019,611022,611023,611024,611025,611026,
        611027,611028,611029,611030,611031,611032,611037,611038,611039,611040,611041,611042,611020,611021,611033,611034,
        611035,611036,611054,611055,611065,611066,611067,611068,611069,611070,611043,611045,611071,611072,611073,611044,
        611046,611074,611075,611076,611077,611078,611079,611080,611047,611049,611052,611081,611082,611048,611051,611053,
        611083,611084,611085,611086,611087,611088,611089,611090,611096,6006024,611010,611011,9900297,611058,611059,
        611060,611061,611062,611063,611064];

    let parameters = [52,452,63,8,904,903,67,1063,1068, 352];

    let to = new SmartDate(gasday).nextGasDay().addDay(1).dt;
    let from = new SmartDate(gasday).nextGasDay().addDay(-1).dt;

    const data = await dataService.selectValueGroupByObjectParameterAsync(objects, parameters, from, to);
    
    return data;
}

exports.selectTemperatures = async (gasday) => {
    let objects = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25];

    let parameters = [1,2,3];

    let _begin = new Date(gasday);
    let _end = new SmartDate(gasday).addDayResetTime(7).dt;

    const data = await dataService.selectValueGroupByObjectAsync(objects, parameters, _begin, _end);
    
    return data;
}

exports.selectActGas = async (from, to) => {
    let objects = [7000001,906023,906024,906035,906026,906022,906021,903031,901033,901032,901031,902031,902032,905031];

    let parameters = [52,452];

    const data = await dataService.selectValueGroupByObjectParameterAsync(objects, parameters, from, to);
    
    return data;
}



exports.statistics = async (gasday) => {
    let objects = [906023, 906024, 906026];
    let parameters = [52];

    let from = new SmartDate("2030-01-01").nextGasDay().dt;
    let to = new SmartDate("2010-01-01").nextGasDay().addDay(-1).dt; 

    const data = await dataService.statistics(objects, parameters, from, to)
    
    
    return data;
}

exports.discreteObjects = async (gasday) => {
    let objects = [906023, 906024, 906026];
    let parameters = [777];

    let to = new SmartDate(gasday).nextGasDay().dt;

    const data = await dataService.discreteObjects(objects, parameters, to);
     
    return data;
}