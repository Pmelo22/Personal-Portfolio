import * as shp from 'shpjs';
import { readFileAsync } from '../utils';
import { Unzip } from '../SldUtil'


async function readSldFilterfilesFromZipUtil(inputData) {
  
  // o metodo original cria um thead a parte para processar os zipados mas não estava funcionando 
  // por isso foi criado esse similar que nao abre uma nova thread.
  const resultData = await readFileAsync(inputData);

  console.log('Entrei no readSldFilterfilesFromZipUtil')

  const sld = Unzip(resultData)

  return sld 

};


export default readSldFilterfilesFromZipUtil;