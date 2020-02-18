import React, { useState, useEffect } from "react";
import './chart.scss';
import { Sprite } from '@inlet/react-pixi';
import * as PIXI from 'pixi.js';
const knownClasses = ['PLANTAE', 'AVES', 'MAMMALIA', 'INSECTA', 'REPTILIA']
let randomSpeed = 0;
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
  useEffect(() => {
    randomSpeed = Math.random() / 10;
    console.log('s', randomSpeed)
  }, []);
  const { name, x, y, fill, kingdomName, speciesClassName } = d;
  const [updatedFill, setFill] = useState(fill);
  const [startTime, setStartTime] = useState(100000);
  useEffect(() => {
    if (shouldStart) {
      setStartTime(seconds);
    }
  }, [shouldStart]);
  const getY = () => {
    const lastPositionY = finalY + y;
    const spriteCount = (seconds - startTime);
    const remainingTime = initialY + Math.pow(spriteCount, 1.2 + randomSpeed);
    const countdown =
      lastPositionY > remainingTime ? remainingTime : lastPositionY;
    return shouldStart ? countdown : initialY;
  };
  return (
    shouldStart && (
      <Sprite
        image={image}
        texture={image ? undefined : PIXI.Texture.WHITE}
        interactive
        anchor={0.5}
        alpha={1}
        key={`${name}${x}`}
        tint={
          !selection || (
            selection === 'OTHERS' && (!knownClasses.includes(kingdomName) && !knownClasses.includes(speciesClassName))
          ) ||
          kingdomName === selection ||
          speciesClassName === selection
            ? updatedFill
            : 0x000000
        }
        x={x}
        y={getY()}
        width={boxHeight / 3}
        height={boxHeight}
        mouseover={e => {
          setFill(0xffffff);
          updateTooltip(d);
        }}
        mouseout={e => {
          setFill(fill);
          updateTooltip({ x, name: null });
        }}
      />
    )
  );
};


export default Specie;
