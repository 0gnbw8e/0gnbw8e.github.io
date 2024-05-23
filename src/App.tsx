import { useState } from 'react';
import { Info } from './components/Info';
import { Map } from './components/Map';

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

/*
MT = C -> (M^-1)MT = (M^-1)C = T

M - Lat, Lon 
[[36.2696808554979, -115.0141488360722, 1, 0, 0, 0],
[0, 0, 0, 36.2696808554979, -115.0141488360722, 1],
[36.274831370253004, -115.00652077545493, 1, 0, 0, 0],
[0, 0, 0, 36.274831370253004, -115.00652077545493, 1],
[36.273955822983254, -115.01196520107368 , 1, 0, 0, 0],
[0, 0, 0, 36.273955822983254, -115.01196520107368 , 1]]

C = left, top
[[433/10.8], [1280/13.5], [433/10.8],  [143/13.5], [105/10.8], [693/13.5]]
*/

// T
let xformFactorsEDC = [-10844.37907787, 7322.193314, 1235518.09244534,
-6917.08587195, -6370.64541234, -481739.04779642];
//let xformFactorsTmap = [-3.05782974e+01,  3.20008685e+03,  3.92898556e+05,
//  -3.32442009e+03, -2.60698859e+01,  1.22482262e+05];

function mapCoords(c: GeolocationCoordinates, affineXform: number[]): dotCoord {
    let left = (affineXform[0] * c.latitude) + (affineXform[1] * c.longitude) + affineXform[2];
    let top = (affineXform[3] * c.latitude) + (affineXform[4] * c.longitude) + affineXform[5];
    return { left: left, top: top };
}

function App() {
    const [lat, setLat] = useState(NaN);
    const [lon, setLon] = useState(NaN);
    const [alt, setAlt] = useState(NaN);
    const [acc, setAcc] = useState(NaN);
    const [ts, setTs] = useState(NaN);

    const [top, setTop] = useState(-100);
    const [left, setLeft] = useState(-100);

    const [alpha,] = useState(NaN);
    const [oob, setOob] = useState(true);

    function getPosCallback(): PositionCallback {
        return ({ coords, timestamp }: GeolocationPosition) => {
            setLat(coords.latitude);
            setLon(coords.longitude);
            setAlt(coords.altitude ? coords.altitude : 0);
            setAcc(coords.accuracy);
            setTs(timestamp);

            let mCoords = mapCoords(coords, xformFactorsEDC);

            if (mCoords.top > 100 || mCoords.top < 0 || mCoords.left > 100 || mCoords.left < 0) {
                setOob(true);
                setTop(0);
                setLeft(0);
            } else {
                setOob(false);
                setTop(mCoords.top);
                setLeft(mCoords.left);
            }

            // compass???
            // window.addEventListener("deviceorientationabsolute", (event) => {
            //   const deviceOrientationEvent = event as DeviceOrientationEvent;
            //   if (deviceOrientationEvent){ 
            //     setAlpha(deviceOrientationEvent.alpha ?? NaN);
            //   }
            //   console.log(event);
            // });

            console.log("got coord: ", coords);
            console.log("map div coords: ", mCoords);
        };
    }

    navigator.geolocation.watchPosition(
        getPosCallback(),
        (err: GeolocationPositionError) => { console.log("got error: ", err) },
        watchOptions,
    )

    return (
        <div className="app">
            <Map
                top={top}
                left={left}
                oob={oob}
            />
            <Info
                lat={lat}
                lon={lon}
                alt={alt}
                acc={acc}
                ts={ts}
                oob={oob}
                alpha={alpha}
            />
        </div>
    );
}

export default App;
