import React from "react";
import './chart.scss';
import * as PIXI from 'pixi.js';
import * as d3 from 'd3';
import { Text } from '@inlet/react-pixi';

const PixiAxis = ({ data, width, margin }) => {
  const extent = d3.extent(data, d => parseInt(d.year, 10));
  const xScale = d3
    .scaleTime()
    .domain(extent)
    .range([0, width - margin.right]);
  const years = [];
  for (let year = extent[0]; year < extent[1]; year += 10) {
    if (year % 50 === 0) {
      years.push(year);
    }
  }

  const textYears = years.map(y => (
    <Text
      text={y}
      anchor={0.5}
      x={xScale(y)}
      y={10}
      isSprite
      style={
        new PIXI.TextStyle({
          fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
          fill: 0xffffff,
          fontSize: 12
        })
      }
    />
  ));
  return textYears;
};

export default PixiAxis;
