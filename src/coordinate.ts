
export interface DotCoord {
  top: number;
  left: number;
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
const TRANSFORM_FACTORS = Object.freeze([-10844.37907787, 7322.193314, 1235518.09244534,
-6917.08587195, -6370.64541234, -481739.04779642]);
//let xformFactorsTmap = [-3.05782974e+01,  3.20008685e+03,  3.92898556e+05,
//  -3.32442009e+03, -2.60698859e+01,  1.22482262e+05];

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