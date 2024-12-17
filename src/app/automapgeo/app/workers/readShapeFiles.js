import * as shp from 'shpjs';
import { expose } from 'threads/worker';
import * as JSZip from 'jszip';
import { readFileAsync } from 'app/utils';

expose(async function readShapefiles(inputFiles) {
    const dataFiles = [];
    for (const file of Array.from(inputFiles)) {
        let resultData = await readFileAsync(file);
        dataFiles.push(resultData);
    }

    console.log('--------- preparando pra ler o zip ------------')
    var zip = new JSZip();
    dataFiles.forEach((inputFile: any, index: number) => {
        zip.file(inputFiles[index].name, inputFile);
    })
    const zipFile: any = await zip.generateAsync({type:"arraybuffer"});

   // const zipFileBlob = await zip.generateAsync({type:"blob"});

    return await shp.parseZip(zipFile);
});
