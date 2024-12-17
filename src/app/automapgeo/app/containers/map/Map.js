import * as React from 'react';
import { Map, TileLayer } from 'react-leaflet';

interface Props {
  position: any;
  zoom: number;
  children: any;
  onMoveEnd: (e: L.LeafletEvent) => void,
  forwardedRef: React.Ref<any>;
}
// definição de stilos so mapa são proprios do map não tem como sobrescrever @@
const _AppMap = (props: Props) => {  
  return (
      <Map         
        style={{ height: '450px', width: '700px', position: 'relative' }}
        center={props.position}
        zoom={props.zoom}
        onMoveEnd={props.onMoveEnd}
        maxZoom={30}
        preferCanvas={true}
        zoomControl={true}
        ref={props.forwardedRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {props.children}
      </Map>
  );
};

export default React.forwardRef((props: any, ref) => {
  return <_AppMap {...props} forwardedRef={ref} />;
})
