import React from "react";
import './chart.scss';
import * as PIXI from 'pixi.js';
import * as d3 from 'd3';
import { Text } from '@inlet/react-pixi';

const PixiAxis = ({ data, xScale, y, seconds }) => {
  const extent = d3.extent(data, d => parseInt(d.year, 10));
  const years = [];
  for (let year = extent[0]; year < extent[1]; year += 10) {
    if (year % 50 === 0) {
      years.push(year);
    }
  }
  const textYears = years.map(year => {
    const alphaCalc = (seconds + years[0] - parseInt(year, 10)) / 100;
    return (
      <Text
        text={year}
        anchor={0.5}
        x={xScale(year)}
        y={y}
        isSprite
        alpha={alphaCalc > 1 ? 1 : alphaCalc}
        style={
          new PIXI.TextStyle({
            fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
            fill: 0xffffff,
            fontSize: 12,
            align: 'center'
          })
        }
      />
    );}
  );
  return textYears;
};

export default PixiAxis;
