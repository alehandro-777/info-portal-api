const fs = require('fs');
const ExcelJS = require('exceljs');
const moment = require('moment');

exports.dbdata2map = (objects, parameters, dbdata) => {
    const result = new Map();
    objects.forEach(object => {
        let objectDbData = dbdata.filter(v => v._id.object == object );
        let rows = dbdata2rows(objectDbData, parameters);
        result.set(object, rows);
    });

    return result;
}

function dbdata2rows(dbdata, parameters) {
    const result = [];

    dbdata.forEach((dbItem, i) => {
        let row = [];

        row.push( new moment(dbItem._id.time_stamp).format("DD.MM.YY HH:mm:SS") );    //first column is time_stamp !!!

        parameters.forEach( par => {
            let v = dbItem.values.find(v => v.parameter == par);
            if (v) {
                row.push(v.value);
            } else {
                row.push(" ");
            }
        });
        result.push(row);
    }); 
    
    return result;
}

exports.createExcellStreamAsync = async (objects, parameters, rowsMap) => {
    
    const workbook = new ExcelJS.Workbook();

    objects.forEach(o => {
        const ws = workbook.addWorksheet(`object ${o}`);
        let rows = rowsMap.get(o);

        let header = ["date time", ...parameters];   //header

        ws.addRows( [header, ...rows] );
    });

    const stream = await workbook2StreemAsync(workbook);

    return stream; 
}

async function workbook2StreemAsync(workbook) {
    //temporary save
    const tmp = `xls/tmp-export.xlsx`;    
    await workbook.xlsx.writeFile(tmp);
    const stream = fs.createReadStream(tmp);
    return stream; 
}

exports.createCsvStreamAsync = async (objects, parameters, rowsMap) => {
    
    const result = [];

    let header = ["object", "date time", ...parameters];   //header    

    result.push( header.join(";") );

    objects.forEach(o => {
        let rows = rowsMap.get(o);
        rows.forEach( row => {
            let joined = row.join(";");        
            result.push( `${o};`+joined );            
        });
    });

    const stream = await arr2CsvStreemAsync(result);

    return stream; 
}


async function arr2CsvStreemAsync(rowsArray) {
    const tmpFile = `xls/tmp-export.csv`; 
    let str = rowsArray.join(";\n");
    await fs.promises.writeFile(tmpFile, str );

    const stream = fs.createReadStream(tmpFile);

    return stream; 
}