import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

const watchOptions = {
  enableHighAccuracy: true,
  timeout: Infinity,
  maximumAge: 0,
}

interface InfoCompProps {
  lat: number,
  lon: number,
  alt: number,
  acc: number,
  ts: number,
}

interface MapCompProps {
  top: number,
  left: number,
}

class CoordConverter {
  topLat: number;
  bottomLat: number;
  leftLon: number;
  rightLon: number;
  rot: number

  constructor(topLat: number, bottomLat: number, leftLon: number, rightLong: number, rot: number){
    this.topLat = topLat;
    this.bottomLat = bottomLat;
    this.leftLon = leftLon;
    this.rightLon = rightLong;
    this.rot = rot;
  }

  // Ignores rotation for now
  mapCoords(loc: GeolocationPosition): [number, number]{
    var top = (this.topLat - loc.coords.latitude) / (this.topLat - this.bottomLat);
    var left = (this.leftLon - loc.coords.longitude) / (this.topLat - this.bottomLat);
    return [Math.abs(top) * 100, Math.abs(left) * 100];
  };
}

function MapComp({top, left} : MapCompProps){
  
  //let mapPath = "edclv_2024_de_festival_map_1080x1350_r04v02-2.png";
  let mapPath = "t_third_map.png";
  let style = {
    top: top + "%",
    left: left + "%",
  }

  return (
    <div id="mapparent">
      <img id="mapimg" src={mapPath} alt="map"/>
      <img id="mapico" src={logo} style={style} alt="location icon"/>
    </div>
  );
}


function InfoComp({lat, lon, alt, acc, ts} : InfoCompProps){
  return (
    <div>
      lat: {lat ? lat : "???"} <br />
      lon: {lon ? lon : "???"} <br />
      alt: {alt ? alt : "???"} <br />
      acc: {acc ? acc : "???"} <br />
      ts: {ts ? ts : "???"} <br />
    </div>
  );
}


function App() {

  const [lat, setLat] = useState(NaN);
  const [lon, setLon] = useState(NaN);
  const [alt, setAlt] = useState(NaN);
  const [acc, setAcc] = useState(NaN);
  const [ts, setTs] = useState(NaN);

  const [top, setTop] = useState(NaN);
  const [left, setLeft] = useState(NaN);



  let conv = new CoordConverter(
    37.8033203442, 
    37.7728736999,
    -122.416327932, 
    -122.385257791,
    0
  )

  function latSetter() : PositionCallback {
    return (loc : GeolocationPosition) => {

      setLat(loc.coords.latitude);
      setLon(loc.coords.longitude);
      setAlt(loc.coords.altitude ? loc.coords.altitude : 0);
      setAcc(loc.coords.accuracy);
      setTs(loc.timestamp);


      var [t, l] = conv.mapCoords(loc);
      setTop(t);
      setLeft(l);

      console.log("got coord: ", loc);      
    };
  }

  navigator.geolocation.watchPosition(
     latSetter(), 
     (err: GeolocationPositionError) => {console.log("got error: ", err)}, 
     watchOptions,
  )  

  return (
  <div className="app">
    <MapComp
      top={top}
      left={left}
    />
    <InfoComp
      lat={lat}
      lon={lon}
      alt={alt}
      acc={acc}
      ts={ts}
    />
  </div>
  );
}

export default App;
