const Value =require('../models/value');

const dataService = require('./data');

async function filterByTimeStamps_GroupByObjParYearMonth(objects, parameters, tsFilter) {
   
    const data = await Value.aggregate([
        { $match: { object:{ $in:objects }, parameter:{ $in: parameters }, time_stamp: { $in: tsFilter } } },
        //{ $sort: { time_stamp: 1 } },
        { $group: { _id: {  object:"$object", parameter:"$parameter", year:{ $year:"$time_stamp"}, month:{ $month:"$time_stamp"} }, 
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
        {$sort:{ "_id.year":1, "_id.month":1 }},
        //{$merge:{into:"month_stats", whenMatched: "replace"}}
    ]);     
    
    return data;
}

async function filterByTimeStamps_GroupByObjPar(objects, parameters, tsFilter) {
   
    const data = await Value.aggregate([
        { $match: { object:{ $in:objects }, parameter:{ $in: parameters }, time_stamp: { $in: tsFilter } } },
        //{ $sort: { time_stamp: 1 } },
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
        {$sort:{ "_id.year":1, "_id.month":1 }},
        //{$merge:{into:"month_stats", whenMatched: "replace"}}
    ]);     
    
    return data;
}

async function filterByTimeStamps_GroupByObjParYearMonthNotIn(objects, parameters, begin, end, tsFilter) {
   
    const data = await Value.aggregate([  
        { $match: { $and:[
            {object:{ $in:objects }},
            {parameter:{ $in: parameters }},
            {time_stamp:{ $gte: begin, $lte: end }},
            {time_stamp:{ $nin: tsFilter }}
        ] } }, 
        //{ $sort: { time_stamp: 1 } },
        { $group: { _id: {  object:"$object", parameter:"$parameter", year:{ $year:"$time_stamp"}, month:{ $month:"$time_stamp"} }, 
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
        {$sort:{ "_id.year":1, "_id.month":1 }},
        //{$merge:{into:"month_stats", whenMatched: "replace"}}
    ]);     
    
    return data;
}

async function filterByTimeStamps_GroupByObjParNotIn(objects, parameters, begin, end, tsFilter) {
   
    const data = await Value.aggregate([
        { $match: { $and:[
            {object:{ $in:objects }},
            {parameter:{ $in: parameters }},
            {time_stamp:{ $gte: begin, $lte: end }},
            {time_stamp:{ $nin: tsFilter }}
        ] } }, 
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
        {$sort:{ "_id.year":1, "_id.month":1 }},
        //{$merge:{into:"month_stats", whenMatched: "replace"}}
    ]);     
    
    return data;
}

//сложные фильтры, в зависимости одних параметров от ведущего

async function smartFilterGroupByObjParYearMonth(objects, parameters, begin, end, MasterObject, MasterParameter, valueFilter) {
    let temp = await dataService.selectValuesFilteredByValueAsync([MasterObject], [MasterParameter], begin, end, valueFilter);
    let tsFilter = temp.map(v=> v.time_stamp);
    let data = await filterByTimeStamps_GroupByObjParYearMonth(objects, parameters, tsFilter);
    return data;
}

async function smartFilterGroupByObjParYearMonthNotIn(objects, parameters, begin, end, MasterObject, MasterParameter, valueFilter) {
    let temp = await dataService.selectValuesFilteredByValueAsync([MasterObject], [MasterParameter], begin, end, valueFilter);
    let tsFilter = temp.map(v=> v.time_stamp);
    let data = await filterByTimeStamps_GroupByObjParYearMonthNotIn(objects, parameters, begin, end, tsFilter);
    return data;
}


async function smartFilterGroupByObjPar(objects, parameters, begin, end, MasterObject, MasterParameter, valueFilter) {
    let temp = await dataService.selectValuesFilteredByValueAsync([MasterObject], [MasterParameter], begin, end, valueFilter);
    let tsFilter = temp.map(v=> v.time_stamp);
    let data = await filterByTimeStamps_GroupByObjPar(objects, parameters, tsFilter);
    return data;
}

async function smartFilterGroupByObjParNotIn(objects, parameters, begin, end, MasterObject, MasterParameter, valueFilter) {
    let temp = await dataService.selectValuesFilteredByValueAsync([MasterObject], [MasterParameter], begin, end, valueFilter);
    let tsFilter = temp.map(v=> v.time_stamp);
    let data = await filterByTimeStamps_GroupByObjParNotIn(objects, parameters, begin, end, tsFilter);
    return data;
}

exports.filterByTimeStamps_GroupByObjPar = filterByTimeStamps_GroupByObjPar;
exports.filterByTimeStamps_GroupByObjParYearMonthNotIn = filterByTimeStamps_GroupByObjParYearMonthNotIn;
exports.filterByTimeStamps_GroupByObjParNotIn = filterByTimeStamps_GroupByObjParNotIn;
exports.filterByTimeStamps_GroupByObjParYearMonth = filterByTimeStamps_GroupByObjParYearMonth;


exports.smartFilterGroupByObjParYearMonth = smartFilterGroupByObjParYearMonth;
exports.smartFilterGroupByObjParYearMonthNotIn= smartFilterGroupByObjParYearMonthNotIn;
exports.smartFilterGroupByObjPar = smartFilterGroupByObjPar;
exports.smartFilterGroupByObjParNotIn = smartFilterGroupByObjParNotIn;