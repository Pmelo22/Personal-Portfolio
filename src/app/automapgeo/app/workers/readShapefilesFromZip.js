import * as shp from 'shpjs';
import { expose } from 'threads/worker';
import { readFileAsync } from '../utils';


expose(async function readShapefilesFromZip(inputData) {
  let resultData = await readFileAsync(inputData);
  return await shp.parseZip(resultData);
});
