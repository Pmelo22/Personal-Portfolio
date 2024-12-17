import * as React from 'react';
import { toastr } from 'react-redux-toastr'
import { useState, useRef, useEffect } from 'react';
import _ from 'lodash'
import Map from '../map/Map';
import Loader from 'react-loader-spinner';
import * as styles from './style.css'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import createParser from '../../parsers/parserFactory';
import { uuidv4 } from '../../utils';
import StyleShape from '../../StyleShape/StyleShape'
// @ts-ignore
import loam from 'loam';

loam.initialize();

/* This code is needed to properly load the images in the Leaflet CSS */
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const App: React.FC = (props) => {
  const mapRef = useRef(null);
  const [zoomPosition, setZoomPosition] = useState({zoom: 7, position: L.latLng(-6.17174, -47.3632)});
  const [overlays, setOverlays] = useState([]);
  const [file, setFile] = useState(); 
  const [sldFilter, setSldFilter] = useState();
  const [legendas, setLegendas] = useState([]);
  let json = {features: [], fileName: null, type: 'FeatureCollection', legendas: []}

  useEffect( () => {
    if(props.files && !file) {
      onDrop(props.files)
    }
}, [props.files])

  const exibirLegendas = async (xmlLegendas) => {
    let legend = await setLegendas(xmlLegendas)
  }

  function onDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  async function onDrop(e: React.DragEvent<HTMLDivElement>) {
    // console.log('onDrop')
    toastr.success('Sucesso', 'Processando arquivo...')
    if(e.preventDefault != undefined) e.preventDefault();
      setOverlays([]); // zerando o mapa
      try{
        // toastr.success('Sucesso', 'files')
        // obtendo o arquivo zipado
        const files = e.dataTransfer ? e.dataTransfer.files : e;
        setFile(files);

        // toastr.success('Sucesso', 'parser')
        // convertendo para Component ReactJs - ShapeFileParser
        const parser = createParser(files, mapRef, props.exportGeoJSON);

        toastr.success('Sucesso', 'Criando GeoJSON...')
        // Convertendo para GeoJsonData e obtendo dados como features, LatLng e Zoom
        const [layerData, sld] = await parser.createLayer()

        toastr.success('Sucesso', 'Criando legendas...')
        // retorna o arquivo completo do SLD
        const xmlNoPadrao = new StyleShape(sld)

        // toastr.success('Sucesso', 'xmlLegendas')
        // console.log(xmlNoPadrao);
        // captura apenas a legenda do arquivo completo
        const xmlLegendas = xmlNoPadrao.GetLegendas()
        // console.log(xmlLegendas);
        exibirLegendas(xmlLegendas)

        // retorna as condições do SLD
        // toastr.success('Sucesso', 'sldFilter')
        const sldFilter = xmlNoPadrao.Buscasldfilter()
        setSldFilter(sldFilter)

        // toastr.success('Sucesso', 'setZoomPosition')
        //----- isso dispara as informações obtidas até aqui no mapa
        setZoomPosition({ zoom: layerData.zoom, position: layerData.center });     
        // console.log('1');
        setOverlays((ovelays: any) => [...ovelays, {show: true, data: layerData, id: uuidv4()}]);

        // props.onDrop(files, parser.getGeoJSON())
        // console.log('2');
      }catch (err) {      
        console.log('Error: '+err);
      }finally{
        // toastr.success('Sucesso', 'finally')
        // console.log('3');
      }
  }

  function onMoveEnd(e: L.LeafletEvent) {
    const center = e.target.getCenter();
    const zoom = e.target.getZoom();
    setZoomPosition({ zoom: zoom, position: center });
    // console.log('onMoveEnd', mapRef.current.leafletElement)
    // addLayer()
    proccessShape()
  }

  function proccessShape() {
    const intervalId = setInterval(() => {
      // console.log('proccessShape()')
      toastr.success('Sucesso', 'Criando estilos...')
      if(overlays[0] && overlays[0].data.data.features) {
        clearInterval(intervalId)

        for (let i = 0; i < overlays[0].data.data.features.length; i++) {
          onEachFeatureHandler(null, 
            Object.entries(
              L.geoJson({...overlays[0].data.data, features: [overlays[0].data.data.features[i]]})._layers
            ).pop()[1]
          )

          overlays[0].data.data.features[i] = null
        }

        // console.log('GeoJSON Completo: ', json, overlays, mapRef.current.leafletElement)

        props.onDrop(file, json)
        setOverlays(null)
        mapRef.current.leafletElement.remove()

        toastr.success('Sucesso', 'Shape Processado, não esqueça de salvar!')
      } else {
        // console.log('overlays[0] vazio')
      }
   }, 250)
  }

  function onEachFeatureHandler(f: any, l: any) {
    // console.log('pecorrendo o features', l);
    
     // Por default vou definir uma borda 0 caso tenha alguma borda dentro do SLD eu adiciono um weight
     l.options.weight = 0
    
    // POINT
    // trabalhando com shapes de ponto com apenas 1 legenda
    if(l.feature.geometry.type == 'Point' && legendas.length == 1){
      // console.log('iniciando ponto');
       l.options.fillColor = legendas[0].FillColor
    }
    
    // POLYGON
    // trabalhando com shapes de poligono com apenas 1 legenda
    if(l.feature.geometry.type == 'Polygon' && legendas.length == 1){
      // console.log('iniciando poligono tipo 1');
      l.options.fillColor = legendas[0].FillColor
      l.options.fillOpacity = 1
    }else if(l.feature.geometry.type == 'Polygon' || l.feature.geometry.type == 'MultiPolygon' && legendas.length > 1){
      // console.log('iniciando poligono tipo 2');
      sldFilter.map((s,i) => {
          // buscando informações se o tipo da consulta for EqualTo
          if(s.name == "ogc:PropertyIsEqualTo") {
            if(l.feature.properties[s.children[0].value] === legendas[i].Title){
                l.options.fillColor = legendas[i].FillColor || null
                l.options.color = legendas[i].StrokeColor || null
                l.options.opacity = legendas[i].StrokeOpacity || null
                l.options.weight = legendas[i].StrokeWidth || 1
                l.options.fillOpacity = legendas[i].fillOpacity || null
                // console.log(s.children, l.feature.properties[s.children[0].value], legendas[i], 'deu');
                // console.log(legendas[i], legendas[i].Title ,l.feature.properties[s.children[0].value], l.options);
                return
            }
          }
          if(s.name == "ogc:PropertyIsBetween") {
            if(Number(parseFloat(l.feature.properties[s.children[0].value])) >= Number(parseFloat(s.children[1].children[0].value)) 
            && Number(parseFloat(l.feature.properties[s.children[0].value])) <= Number(parseFloat(s.children[2].children[0].value))){
                  l.options.fillColor = legendas[i].FillColor || null
                  l.options.color = legendas[i].StrokeColor || null
                  l.options.opacity = legendas[i].StrokeOpacity || null
                  l.options.weight = legendas[i].StrokeWidth || null
                  l.options.fillOpacity = legendas[i].fillOpacity || null
                  return
            }
          }
      })
    }

    // LINE
    // trabalhando com shapes de linha com apenas 1 legenda
    if(l.feature.geometry.type == 'LineString' && legendas.length == 1){
      l.options.fillColor = legendas[0].FillColor
      l.options.fillOpacity = 1
    }else if(l.feature.geometry.type == 'LineString' && legendas.length > 1){
      // console.log('iniciando linha')
      for (let i = 0; i < legendas.length; i++) {
        if(l.feature.properties[sldFilter[0].children[0].value] == legendas[i].Title) {
          l.options.fillColor = legendas[i].FillColor || null
          l.options.color = legendas[i].StrokeColor || null
          l.options.opacity = legendas[i].StrokeOpacity || null
          l.options.weight = legendas[i].StrokeWidth || null
          l.options.fillOpacity = legendas[i].fillOpacity || null
          break
        }
      }

      // console.log(l,sld, sldFilter);
    }

    // 'l.feature' é o GeoJSON da feature individual. O 'json' vai ficar com a mesma estrutura do GeoJSON exportado, porém cada feature terá um atributo 'styles'.
    json.features.push({
      ...l.feature,
      styles: {
        color: l.options.color,
        dashArray: l.options.dashArray,
        dashOffset: l.options.dashOffset,
        fill: l.options.fill,
        fillColor: l.options.fillColor,
        fillOpacity: l.options.fillOpacity,
        fillRule: l.options.fillRule,
        lineCap: l.options.lineCap,
        lineJoin: l.options.lineJoin,
        noClip: l.options.noClip,
        opacity: l.options.opacity,
        pane: l.options.pane,
        smoothFactor: l.options.smoothFactor,
        stroke: l.options.stroke,
        weight: l.options.weight
      }    
    })

    json.legendas = legendas
    
    l.remove()
    l = null
  }
 
  // console.log('props.files', props.files, file)

  return (
    <>
      <div className='containerDiv' style={{ 'display': 'inline-flex', position: 'absolute', zIndex: -1, opacity:0}}  >
        <div className={styles.mainContainer}>      
          <div className={styles.mapContainer} style={{ zIndex: -1, opacity:0}} onDragOver={onDragOver} onDrop={onDrop}  >
              <Map onMoveEnd={onMoveEnd} position={zoomPosition.position} zoom={zoomPosition.zoom} ref={mapRef} >
              </Map>
            </div> 
          </div>
       
      </div>
    </>
  );
};

export default App;
