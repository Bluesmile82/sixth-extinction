import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import { groupBy } from "lodash";
import "./chart.scss";
import Specie from './specie-pixi';
import { Stage, Sprite, Text } from '@inlet/react-pixi';
import PixiAxis from './pixi-axis';
import PixiAxisLines from './pixi-axis-lines';
import * as PIXI from 'pixi.js';
import man from '../images/man.png';
import plant from '../images/plant.png';

const layers = {
  plants: {
    kingdom: 'PLANTAE',
    y: 80,
    color: 0x469e5d,
    image: plant
  },
  birds: {
    class: 'AVES',
    y: 100,
    color: 0xffff00
  },
  mammals: {
    class: 'MAMMALIA',
    y: 120,
    color: 0x775577
  },
  insects: {
    class: 'INSECTA',
    y: 140,
    color: 0xff33ff
  },
  amphibians: {
    class: 'AMPHIBIA',
    y: 160,
    color: 0x3333ff
  },
  reptiles: {
    class: 'REPTILIA',
    y: 180,
    color: 0x44aa77
  },
  gastropodos: {
    class: 'GASTROPODA',
    y: 200,
    color: 0xffffff
  }
};
const width = 1200;
const height = 800;
const boxHeight = 5;
const margin = { top: 20, right: 5, bottom: 20, left: 20 };

const NegativeBarChart = ({ data, setTooltip }) => {
  const [squares, changeSquares] = useState([]);
  const [selection, setSelection] = useState(null);
  const extent = d3.extent(data, d => parseInt(d.year, 10));
  const xScale = d3
    .scaleTime()
    .domain(extent)
    .range([-margin.left, width - margin.right]);

  const getFill = (speciesClassName, kingdomName) => {
    let color = 0xff0000;
    Object.values(layers).forEach(v => {
      if (kingdomName === v.kingdom || speciesClassName === v.class) {
        color = v.color
      }
    });
    return color;
  };

  const getImage = (speciesClassName, kingdomName) => {
    let image = null;
    Object.values(layers).forEach(v => {
      if (kingdomName === v.kingdom || speciesClassName === v.class) {
        image = v.image
      }
    });
    return image;
  };

  useEffect(() => {
    const groupedData = groupBy(data, "year");
    const yearCount = {};
    const squares = [];
    Object.entries(groupedData).forEach(d => {
      const [year, yearAnimals] = d;
      yearAnimals.forEach(animal => {
        const { speciesClassName, kingdomName } = animal;

        yearCount[year] = yearCount[year] ? yearCount[year] + 1 : 1;

        if (year) {
          squares.push({
            x: xScale(parseInt(year, 10)),
            y: yearCount[year] * (boxHeight + 2),
            fill: getFill(speciesClassName, kingdomName),
            year,
            ...animal
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
      if (seconds < extent[1]) { setSeconds(seconds => seconds + 10) };
    }, 10);
    return () => clearInterval(interval);
  }, [seconds]);

  const shouldStart = x => seconds >= x;
  const getY = (speciesClassName, kingdomName) => {
    let y = 200;
    Object.values(layers).forEach(v => {
      if (kingdomName === v.kingdom || speciesClassName === v.class) {
        y = v.y;
      }
    });
    return y;
  };
  const renderXAxis = () =>
    Object.values(layers).map(v => (
      <Text
        text={v.kingdom || v.class}
        anchor={0.5}
        x={50}
        y={v.y}
        isSprite
        interactive
        mouseover={e => {
          setSelection(v.kingdom || v.class);
        }}
        mouseout={e => {
          setSelection(undefined)
        }}
        style={
          new PIXI.TextStyle({
            fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
            fill: v.color,
            fontSize: 12
          })
        }
      />
    ));
  return (
    <React.Fragment>
      <Stage width={width} height={height}>
        <PixiAxis data={data} xScale={xScale} y={10} seconds={seconds} />
        {/* <PixiAxisLines data={data} height={height} xScale={xScale} y={70} /> */}
        {renderXAxis()}
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
            image={getImage(d.speciesClassName, d.kingdomName)}
            d={d}
            y={getY(d.speciesClassName, d.kingdomName)}
            finalY={300}
            shouldStart={shouldStart(d.x)}
            seconds={seconds}
            selection={selection}
            updateTooltip={setTooltip}
            boxHeight={boxHeight}
          />
        ))}
      </Stage>
    </React.Fragment>
  );
};

export default NegativeBarChart;
