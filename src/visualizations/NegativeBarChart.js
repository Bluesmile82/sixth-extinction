import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import { groupBy } from "lodash";
import "./chart.scss";
import Specie from './specie-pixi';
import { Stage, Sprite } from '@inlet/react-pixi';
import PixiAxis from './pixi-axis';
import PixiAxisLines from './pixi-axis-lines';
import man from '../images/man.png';

const width = 650;
const height = 400;
const boxHeight = 5;
const margin = { top: 20, right: 5, bottom: 20, left: 35 };

const NegativeBarChart = ({ data, setTooltip }) => {
  const [squares, changeSquares] = useState([]);
  const extent = d3.extent(data, d => parseInt(d.year, 10));
  const xScale = d3
    .scaleTime()
    .domain(extent)
    .range([-margin.left, width - margin.right]);

  useEffect(() => {
    const groupedData = groupBy(data, "year");
    const yearCount = {};
    const squares = [];
    Object.entries(groupedData).forEach(d => {
      const [year, yearAnimals] = d;
      yearAnimals.forEach(animal => {
        const { name } = animal;

        yearCount[year] = yearCount[year] ? yearCount[year] + 1 : 1;
        if (year) {
          squares.push({
            x: xScale(parseInt(year, 10)),
            y: yearCount[year] * boxHeight,
            fill: 0xff0000,
            stroke: '#fff',
            year,
            name
          });
        }
      });
    });
    changeSquares(squares);
  }, [data]);

  const axisRef = useRef();

  useEffect(() => {
    const xAxis = d3
      .axisTop()
      .tickFormat(d3.format(""))
      .scale(xScale);
    d3.select(axisRef.current)
      .call(xAxis)
      .call(g => g.select(".domain").remove());
  }, [axisRef, data]);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(seconds => seconds + 1);
    }, 1);
    return () => clearInterval(interval);
  }, [seconds]);

  const shouldStart = x => seconds >= x;

  return (
    <React.Fragment>
      <Stage width={width} height={height}>
        <PixiAxis
          data={data}
          xScale={xScale}
          y={10}
          seconds={seconds}
        />
        <PixiAxisLines
          data={data}
          height={height}
          xScale={xScale}
          y={70}
        />
        <Sprite
          image={man}
          tint={0xffffff}
          interactive
          anchor={0.5}
          x={seconds}
          y={50}
          width={50}
          height={50}
        />
        {squares.map(d => (
          <Specie
            key={d.name}
            d={d}
            y={70}
            shouldStart={shouldStart(d.x)}
            seconds={seconds}
            updateTooltip={setTooltip}
          />
        ))}
      </Stage>
    </React.Fragment>
  );
};

export default NegativeBarChart;
