import React, { useState } from "react";
import './chart.scss';
import { Sprite } from '@inlet/react-pixi';
import * as PIXI from 'pixi.js';

const height = 400;
const boxHeight = 5;

const Specie = ({ d, shouldStart, seconds, updateTooltip }) => {
  const { name, x, y, fill, year } = d;
  const [updatedFill, setFill] = useState(fill);
  const [updatedStroke, setStroke] = useState('none');

  const getY = y => {
    const finalY = height / 2 + y;
    const countdown = finalY > seconds ? seconds : finalY;
    return shouldStart ? 0 : countdown;
  };
  return (
    <Sprite
      texture={PIXI.Texture.WHITE}
      interactive
      anchor={0.5}
      key={`${name}${x}${y}`}
      tint={updatedFill}
      x={x}
      y={getY(y)}
      width={boxHeight}
      height={boxHeight}
      mouseover={e => {
        setFill(0xffffff);
        setStroke('white');
        updateTooltip({ x, y, name, year });
      }}
      mouseout={e => {
        setFill(fill);
        setStroke('none');
        updateTooltip({ x, y, name: null });
      }}
    />
  );
};


export default Specie;
