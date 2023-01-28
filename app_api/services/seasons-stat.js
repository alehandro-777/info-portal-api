const SeasonsCollection = require('../models/season');
const seasonStatsCollection = require('../models/seasonStats');
const seasonStatsYMCollection = require('../models/seasonStatsGroupYM');
const smartFiltersService = require('./time-filters');
const dataService = require('./data')

/* ИСХ данные для расчета статистики по сезонам ПСГ Опари

ПСГ Опари.Температура т.р. За вологою	999082	29
ПСГ Опари.Температура т.р. За вуглеводнями	999082	13
ПСГ Опари. Густина газу, кг/м3	999082	14
ПСГ Опари. СО2, моль%	999082	171
ПСГ Опари. Теплота згоряння вища, кВт*год/м3 (0/25)	999082	202
ПСГ Опари. Теплота згоряння вища, кВт*год/м3 (20/25)	999082	539
ПСГ Опари. ВТВ загалом відбор	6090411	63
ПСГ Опари. ВТВ загалом закачка	6090520	63
ПСГ Опари. ВТВ паливний газ загалом	906014	30 - расчетный !!!

ПСГ Опарське закачка	906021	901
ПСГ Опарське отбор	    906021	902

*/
    //data6 дни в которых Т.Р. Н2О > -8
    //data7 дни в которых Т.Р. CH > 0
    //data8 дни в которых паливний газ == 0 ( "самоплив" !!!)

async function create (seasonId) {
    const objectPsg = 906021;

    let result = {};
    let season = await SeasonsCollection.findById(seasonId).exec();

    let tempData = await seasonStatsCollection.find({"_id.season":seasonId}).exec();
    let tempDataYM = await seasonStatsYMCollection.find({"_id.season":seasonId}).exec();

    result.t_r_H2O_ym = tempDataYM.filter(d=> d._id.object == 999082 && d._id.parameter == 29);
    result.t_r_H2O = tempData.filter(d=> d._id.object == 999082 && d._id.parameter == 29);

    result.t_r_CH_ym = tempDataYM.filter(d=> d._id.object == 999082 && d._id.parameter == 13);
    result.t_r_CH = tempData.filter(d=> d._id.object == 999082 && d._id.parameter == 13);

    result.wi_ym = tempDataYM.filter(d=> d._id.object == objectPsg && d._id.parameter == 902);
    result.wi = tempData.filter(d=> d._id.object == objectPsg && d._id.parameter == 902);

    result.in_ym = tempDataYM.filter(d=> d._id.object == objectPsg && d._id.parameter == 901);
    result.in = tempData.filter(d=> d._id.object == objectPsg && d._id.parameter == 901);

    result.vtv_in_ym = tempDataYM.filter(d=> d._id.object == 6090520 && d._id.parameter == 63);
    result.vtv_in = tempData.filter(d=> d._id.object == 6090520 && d._id.parameter == 63);

    result.vtv_wi_ym = tempDataYM.filter(d=> d._id.object == 6090411 && d._id.parameter == 63);
    result.vtv_wi = tempData.filter(d=> d._id.object == 6090411 && d._id.parameter == 63);

    result.pg_ym = tempDataYM.filter(d=> d._id.object == 906014 && d._id.parameter == 30);
    result.pg = tempData.filter(d=> d._id.object == 906014 && d._id.parameter == 30);

    result.p_ym = tempDataYM.filter(d=> d._id.object == 999082 && d._id.parameter == 9);
    result.p = tempData.filter(d=> d._id.object == 999082 && d._id.parameter == 9);

    //bad CH calc
    let tempDataBadCH_ym = await smartFiltersService.smartFilterGroupByObjParYearMonth([objectPsg], [901, 902], season.start, season.end, 999082, 13, {$gt: 0});
    let tempDataBadCH = await smartFiltersService.smartFilterGroupByObjPar([objectPsg], [901, 902], season.start, season.end, 999082, 13, {$gt: 0});
    
    //bad H2O calc
    let tempDataBadH2O_ym = await smartFiltersService.smartFilterGroupByObjParYearMonth([objectPsg], [901, 902], season.start, season.end, 999082, 29, {$gt: -8});
    let tempDataBadH2O = await smartFiltersService.smartFilterGroupByObjPar([objectPsg], [901, 902], season.start, season.end, 999082, 29, {$gt: -8});

    //pal gas > 0 "Samoplyv"
    let tempDataSamoplyv_ym = await smartFiltersService.smartFilterGroupByObjParYearMonthNotIn([906021, 6090520, 6090411], [901, 902, 63], season.start, season.end, 906014, 30, {$gt: 0});
    let tempDataSamoplyv = await smartFiltersService.smartFilterGroupByObjParNotIn([objectPsg, 6090520, 6090411], [901, 902, 63], season.start, season.end, 906014, 30, {$gt: 0});

    //pal pas >0 inverse "Compress"
    let tempDataCompress_ym = await smartFiltersService.smartFilterGroupByObjParYearMonth([objectPsg, 6090520, 6090411], [901, 902, 63], season.start, season.end, 906014, 30, {$gt: 0});
    let tempDataCompress = await smartFiltersService.smartFilterGroupByObjPar([objectPsg, 6090520, 6090411], [901, 902, 63], season.start, season.end, 906014, 30, {$gt: 0});

    result.wi_bad_ch_ym = tempDataBadCH_ym.filter(d=> d._id.object == objectPsg && d._id.parameter == 902);
    result.wi_bad_ch = tempDataBadCH.filter(d=> d._id.object == objectPsg && d._id.parameter == 902);

    result.in_bad_ch_ym = tempDataBadCH_ym.filter(d=> d._id.object == objectPsg && d._id.parameter == 901);
    result.in_bad_ch = tempDataBadCH.filter(d=> d._id.object == objectPsg && d._id.parameter == 901);

    result.wi_bad_h2o_ym = tempDataBadH2O_ym.filter(d=> d._id.object == objectPsg && d._id.parameter == 902);
    result.wi_bad_h2o = tempDataBadH2O.filter(d=> d._id.object == objectPsg && d._id.parameter == 902);

    result.in_bad_h2o_ym = tempDataBadH2O_ym.filter(d=> d._id.object == objectPsg && d._id.parameter == 901);
    result.in_bad_h2o = tempDataBadH2O.filter(d=> d._id.object == objectPsg && d._id.parameter == 901);


    result.wi_samoplyv_ym = tempDataSamoplyv_ym.filter(d=> d._id.object == objectPsg && d._id.parameter == 902);
    result.wi_samoplyv = tempDataSamoplyv.filter(d=> d._id.object == objectPsg && d._id.parameter == 902);
    
    result.vtv_wi_samoplyv_ym = tempDataSamoplyv_ym.filter(d=> d._id.object == 6090411 && d._id.parameter == 63);
    result.vtv_wi_samoplyv = tempDataSamoplyv.filter(d=> d._id.object == 6090411 && d._id.parameter == 63);

    result.in_samoplyv_ym = tempDataSamoplyv_ym.filter(d=> d._id.object == objectPsg && d._id.parameter == 901);
    result.in_samoplyv = tempDataSamoplyv.filter(d=> d._id.object == objectPsg && d._id.parameter == 901);
    
    result.vtv_in_samoplyv_ym = tempDataSamoplyv_ym.filter(d=> d._id.object == 6090520 && d._id.parameter == 63);
    result.vtv_in_samoplyv = tempDataSamoplyv.filter(d=> d._id.object == 6090520 && d._id.parameter == 63);


    //для проверки обратное


    result.wi_compress_ym = tempDataCompress_ym.filter(d=> d._id.object == 906021 && d._id.parameter == 902);
    result.wi_compress = tempDataCompress.filter(d=> d._id.object == 906021 && d._id.parameter == 902);
    
    result.vtv_wi_compress_ym = tempDataCompress_ym.filter(d=> d._id.object == 6090411 && d._id.parameter == 63);
    result.vtv_wi_compress = tempDataCompress.filter(d=> d._id.object == 6090411 && d._id.parameter == 63);

    result.in_compress_ym = tempDataCompress_ym.filter(d=> d._id.object == 906021 && d._id.parameter == 901);
    result.in_compress = tempDataCompress.filter(d=> d._id.object == 906021 && d._id.parameter == 901);
    
    result.vtv_in_compress_ym = tempDataCompress_ym.filter(d=> d._id.object == 6090520 && d._id.parameter == 63);
    result.vtv_in_compress = tempDataCompress.filter(d=> d._id.object == 6090520 && d._id.parameter == 63);


    let temp1 = await dataService.getValueAsync( [objectPsg], [52, 452], season.start);
    result.tact_gas_begin = findByObjectParameter( temp1, objectPsg, 52);

    let temp2 = await dataService.getValueAsync( [objectPsg], [52, 452], season.end);
    result.tact_gas_end = findByObjectParameter( temp2, objectPsg, 52);

    return result;
}

function findArrayByObjectParameter(array, object, parameter) {
    return array.filter(m=> m._id.object == object && m._id.parameter == parameter);
}

function findByObjectParameter(array, object, parameter) {
    return array.find(m=> m.object == object && m.parameter == parameter);
}

function sumByObjectParameter(array, object, parameter) {
    let total = 0;
    array.forEach(day => {
        let v = day.values.find(m=> m.object == object && m.parameter == parameter);
        if (v) {
            total = total + v.value;
        }
    });
    return total;
}


exports.create = create;
