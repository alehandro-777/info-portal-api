const Value = require('../models/value');

exports.getValueAsync = (objects, parameters, time_stamp) => {
    return Value.find({ object:{ $in:objects }, parameter:{ $in:parameters }, time_stamp }).exec();
}

exports.selectValueGroupByObjectParameterAsync = (objects, parameters, begin, end) => {

    return Value.aggregate([
        { $match: { object:{ $in:objects }, parameter:{ $in:parameters }, time_stamp: { $gte: begin, $lte: end }} },
        { $sort: { time_stamp: 1 } },
        { $group: { _id: {  object:"$object", parameter:"$parameter" }, 
            values: { $push: { time_stamp:"$time_stamp", "state": "$state", "value": "$value", "user":"$user" }  }
        }  
        },
    ]); 
}

exports.selectValueGroupByObjectTimeAsync = (objects, parameters, begin, end) => {

    return Value.aggregate([
        { $match: { object:{ $in:objects }, parameter:{ $in:parameters }, time_stamp: { $gte: begin, $lte: end }} },
        { $group: { _id: {  object:"$object", time_stamp:"$time_stamp" }, 
            values: { $push: { "parameter":"$parameter", "state": "$state", "value": "$value", "user":"$user" }  }
        }  
        },
        { $sort: { "_id.time_stamp": 1 } },
    ]); 
}

exports.selectValueGroupByObjectAsync = (objects, parameters, begin, end) => {

    return Value.aggregate([
        { $match: { object:{ $in:objects }, parameter:{ $in:parameters }, time_stamp: { $gte: begin, $lte: end }} },
        { $sort: { time_stamp: 1 } },
        { $group: { _id: "$object", 
            values: { $push: { "time_stamp":"$time_stamp", "state": "$state", "value": "$value", "user":"$user", "parameter":"$parameter" }  }
        }  
        },
    ]); 
}

exports.statistics = async (objects, parameters, begin, end) => {

    const data = await Value.aggregate([
        { $match: { object:{ $in:objects }, parameter:{ $in:parameters }, time_stamp: { $gte: begin, $lte: end }} },
        { $sort: { time_stamp: 1 } },
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

exports.discreteObjects = async (objects, parameters, end) => {

    const data = await Value.aggregate([
        { $match: { object:{ $in:objects }, parameter:{ $in:parameters }, time_stamp: { $lte: end }} },
        { $sort: { time_stamp: -1 } },
        { $group: { _id: {  object:"$object", parameter:"$parameter" }, 
            values: { $push: { time_stamp:"$time_stamp", "state": "$state", "value": "$value", "user":"$user" }  }
        }  
        },
    ]); 
     
    return data;
}

exports.selectValuesFilteredByValueAsync = (objects, parameters, begin, end, valueFilter) => {
    return Value.aggregate([
        { $match: { object:{ $in: objects }, parameter:{ $in: parameters }, time_stamp: { $gte: begin, $lte: end }, value: valueFilter } },
        { $sort: { time_stamp: 1 } },
    ]);         
}