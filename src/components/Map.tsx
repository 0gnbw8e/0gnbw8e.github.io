import type * as CSS from 'csstype';
import target from './target.svg';

interface MapProps {
    top: number,
    left: number,
    oob: boolean,
}

function Map({ top, left, oob }: MapProps) {

    let mapPath = "edclv_2024_de_festival_map_1080x1350_r04v02-2.png";
    //let mapPath = "t_third_map.png";
    let style: CSS.Properties = {
        top: top + "%",
        left: left + "%",
        visibility: oob ? "hidden" : "visible",
    }

    return (
        <div id="mapparent">
            <img id="mapimg" src={mapPath} alt="map" />
            <img id="mapico" src={target} style={style} alt="location icon" />
        </div>
    );
}

export { Map }