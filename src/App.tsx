import { useCallback, useEffect, useMemo, useState } from 'react';
import Info from './components/Info';
import Map from './components/Map';
import { type DotCoord, geoCoordsToDotCoord, isOutOfBounds } from './coordinate';

import './App.css';

const watchOptions = {
  enableHighAccuracy: true,
  timeout: Infinity,
  maximumAge: 0,
};

export default function App() {
  const [coords, setCoords] = useState<GeolocationCoordinates | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);
  const dotCoords = useMemo<DotCoord | null>(
    () => coords ? geoCoordsToDotCoord(coords) : null,
    [coords],
  );
  const isOob = useMemo(
    () => !dotCoords || isOutOfBounds(dotCoords),
    [dotCoords],
  );
  const didChangePosition = useCallback<PositionCallback>(
    ({ coords, timestamp }) => {
      setCoords(coords);
      setLastUpdatedAt(new Date(timestamp));

      console.log("got coord: ", coords);
    }, []
  );
  const didErrorPosition = useCallback<PositionErrorCallback>(
    (err) => { console.log("got error: ", err) },
    []
  );

  const [alpha,] = useState(NaN);

  useEffect(() => {
    const handle = navigator.geolocation.watchPosition(
      didChangePosition,
      didErrorPosition,
      watchOptions,
    );
    return () => {
      navigator.geolocation.clearWatch(handle);
    };
  }, [didChangePosition, didErrorPosition]);


  return (
    <div className="app">
      <Map
        coords={dotCoords}
        isOob={isOob}
      />
      {
        coords && <Info
          coords={coords}
          lastUpdatedAt={lastUpdatedAt}
          isOob={isOob}
          alpha={alpha}
        />
      }
    </div>
  );
}
