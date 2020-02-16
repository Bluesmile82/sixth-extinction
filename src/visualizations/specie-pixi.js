import React, { useState } from "react";
import './chart.scss';
import { Sprite } from '@inlet/react-pixi';
import * as PIXI from 'pixi.js';

const height = 400;
const boxHeight = 10;
const image = 'https://i.imgur.com/IaUrttj.png';

const Specie = ({ d, shouldStart, seconds, updateTooltip }) => {
  const { name, x, y, fill } = d;
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
      key={`${name}${x}${y}`}
      tint={updatedFill}
      x={x}
      y={getY(y)}
      width={boxHeight}
      height={boxHeight}
      mouseover={e => {
        setFill(0xffffff);
        setStroke('white');
        updateTooltip({ x, y, name });
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
