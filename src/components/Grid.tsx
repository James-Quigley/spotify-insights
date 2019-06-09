import React from 'react';

import { Card, CardContent, Typography } from '@material-ui/core';

import RadarChart from "./RadarChart";

const fr = (n: any) => {
    let a = [];
    for (let i = 0; i < n; i++) {
        a.push('1fr');
    }
    return a.join(' ');
}

export default ({ songs, columns }: { songs: Array<any>, columns: number }) => {
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
            songs.map(song =>
                <Card>
                    <CardContent>
                        <Typography variant="h6">{song.name}</Typography>
                        <Typography variant="subtitle1">{song.artists[0].name}</Typography>
                        <RadarChart key={song.name} name={song.name} data={song.audio_features} size={150} margin={50} />
                    </CardContent>
                </Card>)
        }
    </div>)
}