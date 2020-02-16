import React, { useState, useEffect } from "react";
import './chart.scss';
import { Sprite } from '@inlet/react-pixi';
import * as PIXI from 'pixi.js';

const boxHeight = 5;

const Specie = ({
  d,
  shouldStart,
  seconds,
  updateTooltip,
  y: initialY,
  finalY
}) => {
  const { name, x, y, fill, year, speciesClassName } = d;
  const [updatedFill, setFill] = useState(fill);
  const [updatedStroke, setStroke] = useState('none');
  const [startTime, setStartTime] = useState(1000);
  useEffect(() => {
    if (shouldStart) {
      setStartTime(seconds);
    }
  }, [shouldStart]);
  const getY = () => {
    const lastPositionY = finalY + y;
    const remainingTime = seconds - startTime;
    const countdown = lastPositionY > remainingTime ? remainingTime : lastPositionY;
    return shouldStart ? countdown : 0;
  };
  return (
    <Sprite
      texture={PIXI.Texture.WHITE}
      interactive
      anchor={0.5}
      key={`${name}${x}`}
      tint={updatedFill}
      x={x}
      y={initialY + getY()}
      width={boxHeight}
      height={boxHeight}
      mouseover={e => {
        setFill(0xffffff);
        setStroke('white');
        updateTooltip({ x, name, year, speciesClassName });
      }}
      mouseout={e => {
        setFill(fill);
        setStroke('none');
        updateTooltip({ x, name: null });
      }}
    />
  );
};


export default Specie;
