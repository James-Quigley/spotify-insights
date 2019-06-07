import RadarChart from "./RadarChart";

const fr = (n) => {
    let a = [];
    for (let i = 0; i < n; i++) {
        a.push('1fr');
    }
    return a.join(' ');
}

export default ({ songs, columns }) => {
    const rows = Math.ceil(songs.length / columns);

    const gridStyle = {
        display: "grid",
        gridTemplateColumns: fr(columns),
        gridTemplateRows: fr(rows),
        gridColumnGap: '10px',
        gridRowGap: '10px'
    }

    return (<div style={gridStyle}>
        {
            songs.map(song => <div>
                <RadarChart key={song.name} name={song.name} song={song} data={song.audio_features} size={150} margin={50}></RadarChart>
            </div>)
        }
    </div>)
}