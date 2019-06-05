import { useState } from 'react';
import { RadarChart } from '../RadarChart';
const short = require('short-uuid');
const d3 = require('d3');

export default (props) => {
  console.log("props", props);

    var color = d3.scaleOrdinal()
    .range(["#EDC951","#CC333F","#00A0B0"]);
    
    var radarChartOptions = {
      w: 300,
      h: 300,
      margin: {top: 100, right: 100, bottom: 100, left: 100},
      maxValue: 1,
      levels: 5,
      roundStrokes: true,
      color: color
    };
    let data = [{
      name: props.name,
      axes: Object.keys(props.data).map(str => ({
        axis: str,
        value: props.data[str]
      }))
    }];

    let id = short('abcdefghijklmnopqrstuvwxyz').generate();
    requestAnimationFrame(() => {
      RadarChart(`#${id}`, data, radarChartOptions);
    })

    return (<div id={id}>

    </div>)
}