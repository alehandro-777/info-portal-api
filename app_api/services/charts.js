
const SmartDate = require('../../smartdate');
const Value = require('../models/value');

exports.selectOpData = async (gasday) => {
    let objects = [7000001,906023,906024,906035,906026,906022,906021,903031,901033,901032,901031,902031,902032,905031,
        611016,611017,611018,611019,611024,611025,611026,611027,611028,611029,611030,611031,
        611032,611037,611038,611039,611040,611041,611042,611020,611021,611033,611034,611035,611036,611054,611055,611065,
        611066,611067,611068,611069,611070,611043,611045,611071,611072,611073,611044,611046,611074,611075,611076,611077,
        611078,611079,611080,611047,611049,611052,611081,611082,611048,611051,611053,611083,611084,611085,611086,611087,
        611088,611089,611090,611096,6006007,611011, 9900297,611058,611059,611060,611061,611062,611063,611064];

    let parameters = [52,452,902,901,904,903,63,67,1063,1068];

    let _end = new SmartDate(gasday).nextGasDay().dt;
    let _begin = new SmartDate(gasday).nextGasDay().addDay(-1).dt;

    const data = await selectOpDataAsync(objects, parameters, _begin, _end);
    
    //query D+1  ???
    objects = [611012,611013,611022,611023];

    parameters = [63, 67];

    _end = new SmartDate(gasday).nextGasDay().addDay(1).dt;
    _begin = new SmartDate(gasday).nextGasDay().addDay(-1).dt;

    const data1 = await selectOpDataAsync(objects, parameters, _begin, _end);
    //TODO if there is no d+1 ?

    return [...data, ...data1];
}



function selectOpDataAsync(objects, parameters, begin, end) {

    return Value.aggregate([
        { $match: { object:{ $in:objects }, parameter:{ $in:parameters }, time_stamp: { $gte: begin, $lte: end }} },
        { $sort: { time_stamp: -1 } },
        { $group: { _id: {  object:"$object", parameter:"$parameter" }, 
            values: { $push: { time_stamp:"$time_stamp", "state": "$state", "value": "$value", "user":"$user" }  }
        }  
        },
    ]); 
}



exports.statistics = async (gasday) => {
    let objects = [906023, 906024, 906026];
    let parameters = [52];

    let _end = new SmartDate("2030-01-01").nextGasDay().dt;
    let _begin = new SmartDate("2010-01-01").nextGasDay().addDay(-1).dt; 

    const data = await Value.aggregate([
        { $match: { object:{ $in:objects }, parameter:{ $in:parameters }, time_stamp: { $gte: _begin, $lte: _end }} },
        { $sort: { time_stamp:1 } },
        { $group: { _id: {  object:"$object", parameter:"$parameter" }, 
                count: {$sum: 1},
                begin: {$first: "$time_stamp"},
                first: {$first: "$value"},
                avg: {$avg: "$value"},
                sum: {$sum: "$value"},
                max: {$max: "$value"},
                min: {$min: "$value"},
                last: {$last: "$value"},
                end: {$last: "$time_stamp"},
        }  
        },
    ]); 
    
    
    return data;
}

exports.discreteObjects = async (gasday) => {
    let objects = [906023, 906024, 906026];
    let parameters = [777];

    let _end = new SmartDate(gasday).nextGasDay().dt;

    const data = await Value.aggregate([
        { $match: { object:{ $in:objects }, parameter:{ $in:parameters }, time_stamp: { $lte: _end }} },
        { $sort: { time_stamp: -1 } },
        { $group: { _id: {  object:"$object", parameter:"$parameter" }, 
            values: { $push: { time_stamp:"$time_stamp", "state": "$state", "value": "$value", "user":"$user" }  }
        }  
        },
    ]); 
     
    return data;
}