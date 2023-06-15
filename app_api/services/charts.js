const SmartDate = require('../../smartdate');
const dataService = require('./data');

exports.selectOpData = async (gasday) => {
    let objects = [7000001,906023,906024,906035,906026,906022,906021,903031,901033,901032,901031,902031,902032,905031,
        6006037,6006036,9902293,9902294,611012,611013,611016,611017,611018,611019,611022,611023,611024,611025,611026,
        611027,611028,611029,611030,611031,611032,611037,611038,611039,611040,611041,611042,611020,611021,611033,611034,
        611035,611036,611054,611055,611065,611066,611067,611068,611069,611070,611043,611045,611071,611072,611073,611044,
        611046,611074,611075,611076,611077,611078,611079,611080,611047,611049,611052,611081,611082,611048,611051,611053,
        611083,611084,611085,611086,611087,611088,611089,611090,611096,6006024,611010,611011,9900297,611058,611059,
        611060,611061,611062,611063,611064, 611095, 9902302,9902303,9902304,9902305  ];

    let parameters = [52,452,63,8,904,903,67,1063,1068, 352];

    let to = new SmartDate(gasday).nextGasDay().addDay(1).dt;
    let from = new SmartDate(gasday).nextGasDay().addDay(-1).dt;
//console.log(gasday, from, to)
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

exports.selectSetAsync = (id, from, to) => {
    switch (id) {
        case 1:            
            return set1Async(from, to);
        case 2:            
            return set2Async(from, to);    
        case 3:            
            return set3Async(from, to);    
        case 4:            
            return set4Async(from, to);    
        case 5:            
            return set5Async(from, to);
        case 6:            
            return set6Async(from, to);          
        case 7:            
            return set7Async(from, to);    }

    throw new Error('Cant handle this id');
}

//Активний газ графики
set1Async = (from, to) => {
    const objects = [7000001,906023,906024,906035,906026,906022,906021,903031,901033,901032,901031,902031,902032,905031];
    
    const parameters = [52,452];

    return dataService.selectValueGroupByObjectParameterAsync(objects, parameters, from, to);    
}

// ОГТСУ режим
set2Async = (from, to) => {
    const objects = [6000016,6000017,6000014,6000012,906010,906020,906008,6004006,6004007,6000037,6000500,906002,903001,903002,903003,903004,3000337,
                        3000028,903009,903010,3010041,902023,901005,901009,901016,901015,904005,905023,999220,901017,1003419,5060040, 9900241, 9900420, 
                        9900419, 9900403, 9900401, 9900404, 9900405, 9900402, 9900243, 9900242, 9900244, 9900250, 9900289];

    const parameters = [9,8,10,1,2,505,5, 63];

    return dataService.selectValueGroupByObjectParameterAsync(objects, parameters, from, to);    
}

// Комерційна панорама
set3Async = (from, to) => {
    const objects = [611010,611011,611012,611013,611022,611023,611054,611055,611098,611099,611061,611059,611017,611028,611029,611031,611032,611039,611040,
                      611020, 611021, 611033,611034,611035,611036,611102,611103,611104,611105, 9900320, 9900321, 611106, 1611012];

    const parameters = [63, 1063, 1068];

    return dataService.selectValueGroupByObjectParameterAsync(objects, parameters, from, to);    
}

// Споживання
set4Async = (from, to) => {
    const objects = [9900401,9900402,9900403,9900404,9900405];

    const parameters = [8];

    return dataService.selectValueGroupByObjectParameterAsync(objects, parameters, from, to);    
}

// ВТВ
set5Async = (from, to) => {
    const objects = [6006004,6006006,6006005,6102133,6102132,6000081,6103133,6103132,6103113,6102002,6102022,6000082,6102023,6103013,6103032,6103012,6103033,7050111,
        7050112,7050113,7050114,7050121,7050122,7050123,7050124,7060111,7060112,7060114,7060113,7060121,7060122,6090504,7060123,7040102,7040103,7040101,7040102,7040103,
        7040101,1093031,1093032,1093141,1093142,1093143,1091091,1091092,1091093,1091132,1091131,1091133,1100431,1100432,1000469,1100331,1100332,1100333,2110242,2110310,
        2110431,2110570,2110501,2110450,  16006004,16102133,16102002,17050111,17060111,17040102,11093031,11091091,11100431,12110242,12110431,12110501];

    const parameters = [63];

    return dataService.selectValueGroupByObjectParameterAsync(objects, parameters, from, to);    
}

// SCADA
set6Async = (from, to) => {
    const objects = [7000001,999601,999606,906024,903031,906022,902032,905031,901032,906021,902031,901031,906023];

    const parameters = [100,101,102,103,104,105,106,107,108,109,7,6,5,57,2,3,4,1, 13,29,28,12,35,36,37,38,39,40, 41,42, 20,21,22,23,24,25,26];

    return dataService.selectValueGroupByObjectParameterAsync(objects, parameters, from, to);    
}

// HOME
set7Async = (from, to) => {
    const objects = [7000001,9902302,9902305,9902307,9902308,9900241,25,611095,611011,611010,611012,611013,611022,611023,9900405];

    const parameters = [100,101,102,103,104,105,106,107,108,109, 8, 7,6,5,57,2,3,4,1, 13,29,28,12,35,36,37,38,39,40,41,42, 63, 1068, 1063, 67, 903, 904];

    return dataService.selectValueGroupByObjectParameterAsync(objects, parameters, from, to);    
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