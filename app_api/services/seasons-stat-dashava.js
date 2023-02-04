const seasonStatsCollection = require('../models/seasonStats');
const seasonStatsYMCollection = require('../models/seasonStatsGroupYM');
const smartFiltersService = require('./time-filters');
const dataService = require('./data')
const SmartDate = require('../../smartdate')

/* ИСХ данные для расчета статистики по сезонам ПСГ Опари

ПСГ Дашавське.Температура т.р. За вологою	999081	29
ПСГ Дашавське.Температура т.р. За вуглеводнями	999081	13
ПСГ Дашавське. Густина газу, кг/м3	999081	14
ПСГ Дашавське. Теплота згоряння вища, кВт*год/м3 (0/25)	999081	202
ПСГ Дашавське. Теплота згоряння вища, кВт*год/м3 (20/25)	999081	539
ПСГ Дашавське. ВТВ загалом відбор	6080411	63
ПСГ Дашавське. ВТВ загалом закачка	6080520	63
ПСГ Дашавське. ВТВ дкс паливний газ	906014	30
ПСГ Дашавське	906022	902
ПСГ Дашавське	906022	901


*/

async function create (season) {
    const objectPsg = 906022;
    const objectFxp = 999081;
    const objectPG = 906014;
    const vtvInject = 6080520;
    const vtvWith = 6080411;

    let result = {};

    let tempData = await seasonStatsCollection.find({"_id.season": season._id}).exec();
    let tempDataYM = await seasonStatsYMCollection.find({"_id.season": season._id}).exec();

    result.t_r_H2O_ym = tempDataYM.filter(d=> d._id.object == objectFxp && d._id.parameter == 29);
    result.t_r_H2O = tempData.filter(d=> d._id.object == objectFxp && d._id.parameter == 29);

    result.t_r_CH_ym = tempDataYM.filter(d=> d._id.object == objectFxp && d._id.parameter == 13);
    result.t_r_CH = tempData.filter(d=> d._id.object == objectFxp && d._id.parameter == 13);

    result.wi_ym = tempDataYM.filter(d=> d._id.object == objectPsg && d._id.parameter == 902);
    result.wi = tempData.filter(d=> d._id.object == objectPsg && d._id.parameter == 902);

    result.in_ym = tempDataYM.filter(d=> d._id.object == objectPsg && d._id.parameter == 901);
    result.in = tempData.filter(d=> d._id.object == objectPsg && d._id.parameter == 901);

    result.vtv_in_ym = tempDataYM.filter(d=> d._id.object == vtvInject && d._id.parameter == 63);
    result.vtv_in = tempData.filter(d=> d._id.object == vtvInject && d._id.parameter == 63);

    result.vtv_wi_ym = tempDataYM.filter(d=> d._id.object == vtvWith && d._id.parameter == 63);
    result.vtv_wi = tempData.filter(d=> d._id.object == vtvWith && d._id.parameter == 63);

    result.pg_ym = tempDataYM.filter(d=> d._id.object == objectPG && d._id.parameter == 30);
    result.pg = tempData.filter(d=> d._id.object == objectPG && d._id.parameter == 30);

    result.p_ym = tempDataYM.filter(d=> d._id.object == objectFxp && d._id.parameter == 9);
    result.p = tempData.filter(d=> d._id.object == objectFxp && d._id.parameter == 9);

    //bad CH calc
    let tempDataBadCH_ym = await smartFiltersService.smartFilterGroupByObjParYearMonth([objectPsg], [901, 902], season.start, season.end, objectFxp, 13, {$gt: 0});
    let tempDataBadCH = await smartFiltersService.smartFilterGroupByObjPar([objectPsg], [901, 902], season.start, season.end, objectFxp, 13, {$gt: 0});
    
    //bad H2O calc
    let tempDataBadH2O_ym = await smartFiltersService.smartFilterGroupByObjParYearMonth([objectPsg], [901, 902], season.start, season.end, objectFxp, 29, {$gt: -8});
    let tempDataBadH2O = await smartFiltersService.smartFilterGroupByObjPar([objectPsg], [901, 902], season.start, season.end, objectFxp, 29, {$gt: -8});

    //pal gas > 0 "Samoplyv"
    let tempDataSamoplyv_ym = await smartFiltersService.smartFilterGroupByObjParYearMonthNotIn([objectPsg, vtvInject, vtvWith], [901, 902, 63], season.start, season.end, objectPG, 30, {$gt: 0});
    let tempDataSamoplyv = await smartFiltersService.smartFilterGroupByObjParNotIn([objectPsg, vtvInject, vtvWith], [901, 902, 63], season.start, season.end, objectPG, 30, {$gt: 0});

    //pal pas >0 inverse "Compress"
    let tempDataCompress_ym = await smartFiltersService.smartFilterGroupByObjParYearMonth([objectPsg, vtvInject, vtvWith], [901, 902, 63], season.start, season.end, objectPG, 30, {$gt: 0});
    let tempDataCompress = await smartFiltersService.smartFilterGroupByObjPar([objectPsg, vtvInject, vtvWith], [901, 902, 63], season.start, season.end, objectPG, 30, {$gt: 0});

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
    
    result.vtv_wi_samoplyv_ym = tempDataSamoplyv_ym.filter(d=> d._id.object == vtvWith && d._id.parameter == 63);
    result.vtv_wi_samoplyv = tempDataSamoplyv.filter(d=> d._id.object == vtvWith && d._id.parameter == 63);

    result.in_samoplyv_ym = tempDataSamoplyv_ym.filter(d=> d._id.object == objectPsg && d._id.parameter == 901);
    result.in_samoplyv = tempDataSamoplyv.filter(d=> d._id.object == objectPsg && d._id.parameter == 901);
    
    result.vtv_in_samoplyv_ym = tempDataSamoplyv_ym.filter(d=> d._id.object == vtvInject && d._id.parameter == 63);
    result.vtv_in_samoplyv = tempDataSamoplyv.filter(d=> d._id.object == vtvInject && d._id.parameter == 63);


    //для проверки обратное


    result.wi_compress_ym = tempDataCompress_ym.filter(d=> d._id.object == objectPsg && d._id.parameter == 902);
    result.wi_compress = tempDataCompress.filter(d=> d._id.object == objectPsg && d._id.parameter == 902);
    
    result.vtv_wi_compress_ym = tempDataCompress_ym.filter(d=> d._id.object == vtvWith && d._id.parameter == 63);
    result.vtv_wi_compress = tempDataCompress.filter(d=> d._id.object == vtvWith && d._id.parameter == 63);

    result.in_compress_ym = tempDataCompress_ym.filter(d=> d._id.object == objectPsg && d._id.parameter == 901);
    result.in_compress = tempDataCompress.filter(d=> d._id.object == objectPsg && d._id.parameter == 901);
    
    result.vtv_in_compress_ym = tempDataCompress_ym.filter(d=> d._id.object == vtvInject && d._id.parameter == 63);
    result.vtv_in_compress = tempDataCompress.filter(d=> d._id.object == vtvInject && d._id.parameter == 63);


    let temp1 = await dataService.getValueAsync( [objectPsg], [52, 452], season.start);
    result.tact_gas_begin = findByObjectParameter( temp1, objectPsg, 52);
    result.act_gas_begin = findByObjectParameter( temp1, objectPsg, 452);

    let end = season.end ? season.end : new SmartDate().lastGasDay().dt;

    let temp2 = await dataService.getValueAsync( [objectPsg], [52, 452], end);
    result.tact_gas_end = findByObjectParameter( temp2, objectPsg, 52);
    result.act_gas_end = findByObjectParameter( temp2, objectPsg, 452);

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
