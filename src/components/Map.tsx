import type * as CSS from 'csstype';
import target from './target.svg';
import { type DotCoord } from '../coordinate';

const MAP_PATH = "map.webp";

export interface MapProps {
  coords: DotCoord | null;
  isOob: boolean,
}

export default function Map({ coords, isOob: oob }: MapProps) {
  const style: CSS.Properties = {
    display: oob ? "none" : "inline",
    ...(!coords ? {} : {
      top: coords.top + "%",
      left: coords.left + "%",
    })
  }

  return (
    <div id="mapparent">
      <img id="mapimg" src={MAP_PATH} alt="map" />
      <img id="mapico" src={target} style={style} alt="location icon" />
    </div>
  );
}
