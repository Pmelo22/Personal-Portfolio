import * as shp from 'shpjs';
import { readFileAsync } from '../utils';
import { Unzip } from '../sld';


async function readSldfilesFromZip(inputData) {
  
  // o metodo original cria um thead a parte para processar os zipados mas não estava funcionando 
  // por isso foi criado esse similar que nao abre uma nova thread.
  let resultData = await readFileAsync(inputData);

  const sld = Unzip(resultData)

  return sld 

};


export default readSldfilesFromZip;