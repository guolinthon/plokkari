"use client"
import { MapContainer, FeatureGroup, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import Image from 'next/image'
import React, { useEffect, useState, useRef} from 'react';
import 'leaflet/dist/leaflet.css';
import Loading from '../(Loading)/Loading';
import './style.css'
import L from "leaflet";

import "./leaflet.css"
import "./leaflet.draw.css"

function SetViewOnClick({zoom}) {
  const map = useMap();
  console.log(map.getCenter().lat)
  useEffect(() => {
  map.flyTo(map.getCenter(),zoom,{
    animate: true,
    duration: 1 // in seconds
  });
});
return null;

}

function Centralcircle({}) {
  const map = useMap();
  let circle = null;
  map.eachLayer(function(layer) {
    if (layer.options && layer.options.id === 'circle') {
      circle = layer;
    }
  }); 
  if (!circle) {
    circle = L.circleMarker(map.getCenter(), {
      radius: 10,
      color: 'green',
      fillOpacity: 0.2,
      id: 'circle' // Add an ID to the circle layer
    }).addTo(map);
  }
  map.on('move',function(e){
  circle.setLatLng(map.getCenter());
  map._renderer._update();
  });
  }



const OpenStreetMap = ({ zoom }) => {
  const [mapCenter, setMapCenter] = useState(null);
  const [CurrentZoomLevel, setCurrentZoomLevel] = useState(null);

  const RuIcon = new L.Icon({
    iconUrl: "/RU_logo_no_text.png",
    iconSize: [50, 50],
    iconAnchor: [25, 25]
  });
  

  const options = {
    enableHighAccuracy: true,
    maximumAge: 30000,
    timeout: 27000
  };

  useEffect(() => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        // Save the location
        setMapCenter({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });

      },
      (error: GeolocationPositionError) => {
        console.log("Error getting location")

        // In case of an error, show Reykjavík University
        setMapCenter({
          latitude: 64.124025,
          longitude: -21.925479
        });
      },
      options
    );
  } else {
    console.log("Geolocation is not supported by this browser.");
    // In case of an error, show Reykjavík University
    setMapCenter({
      latitude: 64.124025,
      longitude: -21.925479
    });
  }
}, []);

// Wait while geting location
if (!mapCenter) {
  return <Loading />;
}
const { latitude, longitude } = mapCenter;

return (
  <MapContainer 
    center={[latitude, longitude]} 
    zoom={zoom} scrollWheelZoom={true} 
    style={{ width: "100%", height: "100vh", margin: '0'}} 
    zoomControl={false} 
    onZoomEnd={() => setCurrentZoomLevel(useMap().getZoom())}>
    <TileLayer
      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> 
      contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <Marker icon={RuIcon} position={[64.123721, -21.926725]}>
      <Popup>
        <Image 
          src="/RU_logo.png" 
          width={200} 
          height={0} />   
        Reykjavík University <br /> Where it all began.
      </Popup>
    </Marker>
    <SetViewOnClick zoom={zoom}/>
    <Centralcircle />
    {/* <FeatureGroup >
      <EditControl
        ref={editRef}
        position='bottomright'
        onCreated={onShapeDrawn}
        //here you can specify your shape options and which handler you want to enable
        draw={{
          rectangle: false,
          circle: false,
          polyline: false,
          circlemarker: false,
          marker: false,
          polygon: {
            allowIntersection: false,
            shapeOptions: {
              color: "#ff0000"
              },
          }
        }}/>
    </FeatureGroup> */}
  </MapContainer>
);
};

export default OpenStreetMap