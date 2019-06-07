import { useState } from 'react';
import { RadarChart } from '../RadarChart';
import { Card, CardContent, Typography } from '@material-ui/core';
import { useTheme, makeStyles } from '@material-ui/styles';
const short = require('short-uuid');
const d3 = require('d3');

const colors = ["#EDC951", "#CC333F", "#00A0B0", "#00DC45", "#C125B4", "#E64FAC", "#F29646", "#4deeea", "#ffe700", "#001eff"];

export default (props) => {
  const randColor = colors[Math.floor(Math.random() * colors.length)]
  var color = d3.scaleOrdinal()
    .range([randColor]);

  var radarChartOptions = {
    w: props.size,
    h: props.size,
    margin: { top: props.margin, right: props.margin, bottom: props.margin, left: props.margin },
    maxValue: 1,
    levels: 5,
    roundStrokes: true,
    color: color
  };
  const keys = ['danceability', 'energy', 'speechiness', 'acousticness', 'instrumentalness', 'liveness', 'valence'];
  let data = [{
    name: props.name,
    axes: Object.keys(props.data).filter(k => keys.includes(k)).map(str => ({
      axis: str,
      value: props.data[str]
    }))
  }];

  let id = short('abcdefghijklmnopqrstuvwxyz').generate();
  requestAnimationFrame(() => {
    RadarChart(`#${id}`, data, radarChartOptions);
  })

  const useStyles = makeStyles(theme => ({
  }));
  const classes = useStyles();

  return (<Card color="primary">
    <CardContent>
      {
        props.children ? props.children : ''
      }
      <Typography variant='h6'>{props.name}</Typography>
      <Typography variant="caption">{props.song ? props.song.artists[0].name : ''}</Typography>
      <div id={id}>
      </div>
    </CardContent>
  </Card>)
}