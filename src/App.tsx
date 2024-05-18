import React, { useState } from 'react';
import target from './target.svg';
import './App.css';

const watchOptions = {
  enableHighAccuracy: true,
  timeout: Infinity,
  maximumAge: 0,
}

type dotCoord = {
  top: number,
  left: number,
}

// Lat, Lon
/*
[[37.78747696541701, -122.39122815663572, 1, 0, 0, 0],
[0, 0, 0, 37.78747696541701, -122.39122815663572, 1],
[37.794991015857136, -122.41484686605361, 1, 0, 0, 0],
[0, 0, 0, 37.794991015857136, -122.41484686605361, 1],
[37.77404788772288, -122.41438750839272 , 1, 0, 0, 0],
[0, 0, 0, 37.77404788772288, -122.41438750839272 , 1]]
*/

// left, top
/*
[[496/6.16], [385/7.47], [29/6.16],  [203/7.47], [42/6.16], [723/7.47]]
*/
//let xformFactorsTmap = [-3.05782974e+01,  3.20008685e+03,  3.92898556e+05,
//  -3.32442009e+03, -2.60698859e+01,  1.22482262e+05];


// Lat, Lon
/*
[[36.26964351416783, -115.01410766343376, 1, 0, 0, 0],
[0, 0, 0, 36.26964351416783, -115.01410766343376, 1],
[36.274781658180686, -115.00648228859261, 1, 0, 0, 0],
[0, 0, 0, 36.274781658180686, -115.00648228859261, 1],
[36.27400384120922, -115.01212167525291 , 1, 0, 0, 0],
[0, 0, 0, 36.27400384120922, -115.01212167525291 , 1]]
*/

// left, top
/*
[[431/10.8], [1280/13.5], [431/10.8],  [125/13.5], [103/10.8], [720/13.5]]
*/
let xformFactorsEDC = [-10049.343367, 6771.46691539, 1143340.23372572,
   -6352.8128599 ,   -6939.18519377, -567595.12041725];

interface InfoCompProps {
  lat: number,
  lon: number,
  alt: number,
  acc: number,
  ts: number,
  alpha: number;
}

interface MapCompProps {
  top: number,
  left: number,
}

function mapCoords(loc: GeolocationPosition,  affineXform: number[]): dotCoord {
  let left = (affineXform[0] * loc.coords.latitude) + (affineXform[1] * loc.coords.longitude) + affineXform[2];
  let top  = (affineXform[3] * loc.coords.latitude) + (affineXform[4] * loc.coords.longitude) + affineXform[5];
  left = ((left % 100) + 100) % 100;
  top = ((top % 100) + 100) % 100;
  return {left: left, top: top};
}

function MapComp({top, left} : MapCompProps){
  
  let mapPath = "edclv_2024_de_festival_map_1080x1350_r04v02-2.png";
  //let mapPath = "t_third_map.png";
  let style = {
    top: top + "%",
    left: left + "%",
  }

  return (
    <div id="mapparent">
      <img id="mapimg" src={mapPath} alt="map"/>
      <img id="mapico" src={target} style={style} alt="location icon"/>
    </div>
  );
}

function InfoComp({lat, lon, alt, acc, ts, alpha} : InfoCompProps){

  let timeString = "unknown"
  if (ts) {
    let updateTime = new Date(ts);
    timeString = `${updateTime.getHours()}:${updateTime.getMinutes()}:${updateTime.getSeconds()}:${updateTime.getMilliseconds()}`;
  }
  return (
    <div>
      lat: {lat ? lat : "???"} <br />
      lon: {lon ? lon : "???"} <br />
      alt: {alt ? alt : "???"} <br />
      acc: {acc ? acc + "m" : "???"} <br />
      last update: {timeString} <br />
      device orientation: {alpha ?? "no orientation"} <br /> 
    </div>
  );
}


function App() {

  const [lat, setLat] = useState(NaN);
  const [lon, setLon] = useState(NaN);
  const [alt, setAlt] = useState(NaN);
  const [acc, setAcc] = useState(NaN);
  const [ts, setTs] = useState(NaN);

  const [top, setTop] = useState(-100);
  const [left, setLeft] = useState(-100);

  const [alpha, setAlpha] = useState(NaN);

  function  getPosCallback() : PositionCallback {
    return (loc : GeolocationPosition) => {
      setLat(loc.coords.latitude);
      setLon(loc.coords.longitude);
      setAlt(loc.coords.altitude ? loc.coords.altitude : 0);
      setAcc(loc.coords.accuracy);
      setTs(loc.timestamp);

      let coords = mapCoords(loc, xformFactorsEDC);
      setTop(coords.top);
      setLeft(coords.left);

      // compass???
      // window.addEventListener("deviceorientationabsolute", (event) => {
      //   const deviceOrientationEvent = event as DeviceOrientationEvent;
      //   if (deviceOrientationEvent){ 
      //     setAlpha(deviceOrientationEvent.alpha ?? NaN);
      //   }
      //   console.log(event);
      // });


      console.log("got coord: ", loc);
      console.log("div coords: ", coords);
    };
  }

  navigator.geolocation.watchPosition(
    getPosCallback(), 
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
      alpha={alpha}
    />
  </div>
  );
}

export default App;
