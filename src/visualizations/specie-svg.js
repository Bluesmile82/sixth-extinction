import React, { useState } from "react";
import './chart.scss';

const height = 400;
const boxHeight = 5;

const Specie = ({ d, shouldStart, seconds, updateTooltip }) => {
  const { name, x, y, fill } = d;
  const [updatedFill, setFill] = useState(fill);
  const [updatedStroke, setStroke] = useState("none");

  const getY = y => {
    const finalY = height / 2 + y;
    const countdown = finalY > seconds ? seconds : finalY;
    return shouldStart ? 0 : countdown;
  };

  return (
    <rect
      key={`${name}${x}${y}`}
      x={x}
      y={getY(y)}
      width={boxHeight}
      height={boxHeight}
      fill={updatedFill}
      stroke={updatedStroke}
      fillOpacity="70%"
      onMouseEnter={e => {
        setFill("red");
        setStroke("white");
        updateTooltip({ x, y, name });
      }}
      onMouseLeave={e => {
        setFill(fill);
        setStroke("none");
        updateTooltip({ x, y, name: null });
      }}
    />
  );
};


export default Specie;
