import React, { useState, useEffect } from "react";
import './chart.scss';
import { Sprite } from '@inlet/react-pixi';
import * as PIXI from 'pixi.js';

const Specie = ({
  d,
  shouldStart,
  seconds,
  updateTooltip,
  y: initialY,
  finalY,
  boxHeight,
  image,
  selection
}) => {
  const { name, x, y, fill, kingdomName, speciesClassName } = d;
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
    const remainingTime = seconds - startTime + initialY;
    const countdown =
      lastPositionY > remainingTime ? remainingTime : lastPositionY;
    return shouldStart ? countdown : initialY;
  };
  return (
    <Sprite
      image={image}
      texture={image ? undefined : PIXI.Texture.WHITE}
      interactive
      anchor={0.5}
      alpha={0.5}
      key={`${name}${x}`}
      tint={
        !selection ||
        kingdomName === selection ||
        speciesClassName === selection
          ? updatedFill
          : 0x000000
      }
      x={x}
      y={getY()}
      width={boxHeight}
      height={boxHeight}
      mouseover={e => {
        setFill(0xffffff);
        setStroke('white');
        updateTooltip(d);
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
