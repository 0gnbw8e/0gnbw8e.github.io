import type * as CSS from 'csstype';
import target from './target.svg';
import { type DotCoord } from '../coordinate';

const MAP_PATH = "edclv_2024_de_festival_map_1080x1350_r04v02-2.png";

export interface MapProps {
  coords: DotCoord | null;
  isOob: boolean,
}

export function Map({ coords, isOob: oob }: MapProps) {
  const style: CSS.Properties = {
    visibility: oob ? "hidden" : "visible",
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
