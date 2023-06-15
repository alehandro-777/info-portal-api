const Value =require('../models/value');

async function derivate(objects, parameters, begin, end) {
    return Value.aggregate( [ 
        { $match: { object:{ $in: objects }, parameter:{ $in: parameters }, time_stamp: { $gte: begin, $lte: end }} },
        { $setWindowFields: {
              partitionBy: "$object",
              sortBy: { time_stamp: 1 },
              output: { dayChange: { $derivative: { input: "$value", unit: "day"}, window: { range: [ -1, 0 ], unit: "day" } } }
           }
        },

        //{ $match: { dayChange: { $lt: 10, $gt: -10 } } }

     ] )
}

async function filterByValGroupByYearStats(objects, parameters, begin, end) {
    const data = await Value.aggregate([
        { $match: { object:{ $in:objects }, parameter:{ $in:parameters }, time_stamp: { $gte: begin, $lte: end } } },
        { $sort: { time_stamp: 1 } },
        { $group: { _id: {  object:"$object", parameter:"$parameter", year:{$year:"$time_stamp"} }, 
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
        {$sort:{ "_id.year":1}},
        //{$merge:{into:"month_stats", whenMatched: "replace"}}
    ]);         
    return data;
}

async function findMinMaxInYearRange(objects, parameters, begin, end, min_day, max_day) {
    const data = await Value.aggregate([        
        { $match: { object:{ $in:objects }, parameter:{ $in:parameters }, time_stamp: { $gte: begin, $lte: end } } },
        { $project: {object:1, parameter:1, time_stamp:1, value:1, year_day: {"$dayOfYear": "$time_stamp"} }},
        
        { $match: { year_day: { $gte: min_day, $lte: max_day } } }, //60...152  244...335
        
        { $sort: { time_stamp: 1 } },
        { $group: { _id: {  object:"$object", parameter:"$parameter", year:{$year:"$time_stamp"} }, 
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
        {$sort:{ "_id.year":1}},
        //{$merge:{into:"month_stats", whenMatched: "replace"}}
    ]);         
    return data;
}

async function findSeasonInYears(objects, parameters, begin, end) {
    let res = [];
    let inj = await findMinMaxInYearRange(objects, parameters, begin, end, 244, 335);
    for (let i = 0; i < inj.length; i++) {
        const stat = inj[i];
        let v = await getTimeStampAsync(stat._id.object, stat._id.parameter, stat.max, stat.begin, stat.end);
        let dt = new Date(v[0].time_stamp);
        dt.setDate(dt.getDate() + 1); //next day after max
        let season = {
            object: stat._id.object,
            state: "Відбір",
            value: 2,
            act_gas: stat.max,
            start: dt
        }
        res.push(season);
    }

    let wit = await findMinMaxInYearRange(objects, parameters, begin, end, 60, 152);    //60...152

    for (let i = 0; i < wit.length; i++) {
        const stat = wit[i];
        let v = await getTimeStampAsync(stat._id.object, stat._id.parameter, stat.min, stat.begin, stat.end);
        let dt = new Date(v[0].time_stamp);
        dt.setDate(dt.getDate() + 1);   //next day after min
        let season = {
            object: stat._id.object,
            state: "Закачка",
            value: 1,
            act_gas: stat.min,
            start: dt
        }
        res.push(season);
    }

    res.sort((a, b) => a.start.getTime() - b.start.getTime())
    addChange(res);
    return res;
}

function addChange(array) {
    for (let i = 0; i < array.length-1; i++) {
        const current = array[i];
        const next = array[i+1];
        next.change = next.act_gas - current.act_gas;
    }
}

async function getTimeStampAsync(object, parameter, value, begin, end) {
    return Value.find({ object: object, parameter: parameter, value: value, time_stamp: { $gte: begin, $lte: end } }).exec();
}

async function findTimeStampes(stats) {
    for (let i = 0; i < stats.length; i++) {
        const s = stats[i];
        if (s.min) {
            let min = await getTimeStampAsync( s._id.object, s._id.parameter, s.min, s.begin, s.end);        
            s.min_ts = min[0].time_stamp;    
        }
        if (s.max) {
            let max = await getTimeStampAsync( s._id.object, s._id.parameter, s.max, s.begin, s.end);
            s.max_ts = max[0].time_stamp;    
        }
    }
}

function findExtremum(stats) {
    let res = [];
    for (let i = 0; i < stats.length-1; i++) {
        const s = stats[i];
        const s1 = stats[i+1];
        if (s.dayChange < 0 &&  s1.dayChange > 0) {
            //inject....
            let v = { 
                object : s.object,
                act_gas: s.value,
                begin : s1.time_stamp,
                state : "Закачка",
                value : 1,
                change : s1.dayChange, 
            }            
            res.push(v)
        }
        if (s.dayChange > 0 &&  s1.dayChange < 0) {
            //withdr...
            let v = { 
                object : s.object,
                act_gas: s.value,
                state : "Відбір",
                begin : s1.time_stamp,
                value : 2, 
                change : s1.dayChange,
            }            
            res.push(v)
        }
    }
    return res;
}

exports.findTimeStampes = findTimeStampes;
exports.derivate = derivate;
exports.filterByValGroupByYearStats = filterByValGroupByYearStats;
exports.getTimeStampAsync = getTimeStampAsync;
exports.findExtremum = findExtremum;
exports.findMinMaxInYearRange = findMinMaxInYearRange;
exports.findSeasonInYears = findSeasonInYears;
