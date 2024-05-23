interface InfoProps {
    lat: number,
    lon: number,
    alt: number,
    acc: number,
    ts: number,
    oob: boolean,
    alpha: number;
}


function Info({ lat, lon, alt, acc, ts, oob, alpha }: InfoProps) {

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
            out of map bounds: {oob ? "yes :(" : "no :)"}  <br />
        </div>
    );
}


export { Info }