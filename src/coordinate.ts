
export interface DotCoord {
  top: number;
  left: number;
}

const TRANSFORM_FACTORS = Object.freeze([-776.40707386, 3979.62416204, 516836.79338019,
-10687.04643794, -1287.48249236, 245989.35860223]);


// [  -776.40707386,   3979.62416204, 516836.79338019, -10687.04643794,  -1287.48249236, 245989.35860223]
function _geoCoordsToDotCoord(c: GeolocationCoordinates, affineXform: readonly number[]): DotCoord {
  let left = (affineXform[0] * c.latitude) + (affineXform[1] * c.longitude) + affineXform[2];
  let top = (affineXform[3] * c.latitude) + (affineXform[4] * c.longitude) + affineXform[5];
  return { left, top };
}

export function geoCoordsToDotCoord(c: GeolocationCoordinates): DotCoord {
  return _geoCoordsToDotCoord(c, TRANSFORM_FACTORS);
}

export function isOutOfBounds(coords: DotCoord): boolean {
  return (coords.top > 100 || coords.top < 0 || coords.left > 100 || coords.left < 0);
}