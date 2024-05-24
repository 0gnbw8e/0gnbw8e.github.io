export interface InfoProps {
  coords: GeolocationCoordinates;
  lastUpdatedAt: Date | null;

  oob: boolean,
  alpha: number;
}

const formatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'short',
  timeStyle: 'full',
});

export function Info({ coords, lastUpdatedAt, oob, alpha }: InfoProps) {
  return (
    <div>
      lat: {coords.latitude ?? "???"} <br />
      lon: {coords.longitude ?? "???"} <br />
      alt: {coords.altitude ?? "???"} <br />
      acc: {coords.accuracy ? `${coords.accuracy}m` : "???"} <br />
      last update: {lastUpdatedAt ? formatter.format(lastUpdatedAt) : 'unknown'} <br />
      out of map bounds: {oob ? "yes :(" : "no :)"}  <br />
    </div>
  );
}