import { CoordSet } from 'src/types';

export const calcDistanceInMeter = (coordSet: CoordSet) => {
  const { startLat, startLng, endLat, endLng } = coordSet;

  const R = 6371e3; // radius of the Earth in meters
  const phi1 = (startLat * Math.PI) / 180; // convert latitude 1 to radians
  const phi2 = (endLat * Math.PI) / 180; // convert latitude 2 to radians
  const deltaPhi = ((endLat - startLat) * Math.PI) / 180; // convert latitude difference to radians
  const deltaLambda = ((endLng - startLng) * Math.PI) / 180; // convert longitude difference to radians

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) *
      Math.cos(phi2) *
      Math.sin(deltaLambda / 2) *
      Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // distance between the two coordinates in meters
};
