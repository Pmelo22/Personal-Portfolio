import { spawn, Thread, Worker } from 'threads';
import * as L from 'leaflet';
import Parser from "./base";
import GeoJsonData from '../geodata/geoJsonData';
import readShapeFilesFromZipFunction from '../workers/readShapefilesFromZipFunction'
// import readSldfilesFromZipFunction from '../workers/readSldfilesFromZipFunction'

export default class ShapefileParser extends Parser {
    constructor(files, mapRef) {
        super(files, mapRef)
        // this.geoJSON = null
       
    }

    // getGeoJSON = () => this.geoJSON

    async createLayer() {

        let data = null;   
        // console.log(this.files.length)

        if (this.files.length === 1) {
            
            // metodo abaixo ta bugado por isso criamos um novo quando digo criamos estou falando de Deus e
            //const readShapefilesFromZip = await spawn(new Worker('../workers/readShapefilesFromZip')); 
              //data = await readShapefilesFromZip(this.files[0]);
           // await Thread.terminate(readShapefilesFromZip);
            
            // console.log('arquivo antes de ser lido de fato /  enviar para php salvar em alguma pasta ')
            // console.log(this.files[0])
            const readShapefilesFromZip = await readShapeFilesFromZipFunction(this.files[0])
            data = readShapefilesFromZip
            
            // this.geoJSON = data // + o xml aqui
            // console.log('Retorno de Leitura como GeoJson / enviar para salvar na base depois da ação do usuário')
            // console.log(data)
        }else{ 
            const readShapeFiles = await spawn(new Worker('../workers/readShapeFiles'));
            data = await readShapeFiles(this.files);
            await Thread.terminate(readShapeFiles);             
        }

        var geoJosnOverlay = new L.GeoJSON(data[0]);
        const geoJsonBounds = geoJosnOverlay.getBounds();
        const zoom = this.mapRef.current.leafletElement.getBoundsZoom(geoJsonBounds);
        const center = geoJsonBounds.getCenter();
        return [new GeoJsonData(data[0], zoom, center), data[1]]    
    }

    // async createSld() {

    //     let data = null;   
    //     // console.log(this.files.length)

    //     if (this.files.length === 1) {            
          
    //         const readShapefilesFromZip = await readSldfilesFromZipFunction(this.files[0])
    //         data = readShapefilesFromZip
            
    //         // this.geoJSON = data // + o xml aqui
         
    //     }       
       
    //     return data    
    // }

}