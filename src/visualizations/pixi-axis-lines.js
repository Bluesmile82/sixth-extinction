import React from "react";
import './chart.scss';
import * as PIXI from 'pixi.js';
import * as d3 from 'd3';
import { Sprite } from '@inlet/react-pixi';

const PixiAxis = ({ data, width, margin, height, xScale }) => {
  const extent = d3.extent(data, d => parseInt(d.year, 10));
  const years = [];
  for (let year = extent[0]; year < extent[1]; year += 10) {
    if (year % 10 === 0) {
      years.push(year);
    }
  }

  const textYears = years.map(y => (
    <Sprite
      texture={PIXI.Texture.WHITE}
      tint={0x555555}
      x={xScale(y)}
      y={10}
      width={1}
      height={height}
    />
  ));
  return textYears;
};

export default PixiAxis;
