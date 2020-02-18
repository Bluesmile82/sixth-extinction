import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import { groupBy, sortBy } from "lodash";
import "./chart.scss";
import Specie from './specie-pixi';
import { Stage, Sprite, Text } from '@inlet/react-pixi';
import PixiAxis from './pixi-axis';
import PixiAxisLines from './pixi-axis-lines';
import * as PIXI from 'pixi.js';
import man from '../images/man.png';
import useInterval from '@use-it/interval';
import plant from '../images/plant.png';
import { useTick, useApp } from '@inlet/react-pixi';

const layers = {
  plants: {
    kingdom: 'PLANTAE',
    y: 160,
    color: 0xff0000
  },
  birds: {
    class: 'AVES',
    y: 200,
    color: 0xff0000
  },
  mammals: {
    class: 'MAMMALIA',
    y: 240,
    color: 0xff0000
  },
  insects: {
    class: 'INSECTA',
    y: 280,
    color: 0xff0000
  },
  amphibians: {
    class: 'REPTILIA',
    y: 320,
    color: 0xff0000
  },
  reptiles: {
    class: 'REPTILIA',
    y: 360,
    color: 0xff0000
  },
  gastropodos: {
    class: 'GASTROPODA',
    y: 400,
    color: 0xff0000
  },
  others: {
    class: 'OTHERS',
    y: 440,
    color: 0xff0000
  }
};

const squarePadding = 2;
const width = 1200;
const height = 800;
const boxHeight = 5;
const margin = { top: 20, right: 50, bottom: 20, left: 50 };

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

  const getY = (speciesClassName, kingdomName) => {
    let y = 400;
    Object.values(layers).forEach(v => {
      if (kingdomName === v.kingdom || speciesClassName === v.class) {
        y = v.y;
      }
    });
    return y;
  };

  useEffect(() => {
    const groupedData = groupBy(sortBy(data, 'speciesClassName'), 'year');
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
            y: yearCount[year] * (boxHeight + squarePadding),
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

  useInterval(() => {
    if (seconds < 1500) {
      setSeconds(seconds => seconds + 3);
    }
  }, 10);

  const shouldStart = x => seconds >= x;

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
    const finalSeconds = 1180;
  return (
    <React.Fragment>
      <Stage
        width={width}
        height={height}
        options={{
          resolution: 1,
          roundPixel: true,
          forceFXAA: true,
          sharedTicker: true
        }}
      >
        <PixiAxis data={data} xScale={xScale} y={10} seconds={seconds} />
        {/* <PixiAxisLines data={data} height={height} xScale={xScale} y={70} /> */}
        {/* {renderXAxis()} */}
        <Sprite
          image={man}
          interactive
          anchor={0.5}
          x={seconds < finalSeconds ? seconds : finalSeconds}
          y={50}
          width={50}
          height={50}
        />
        {Object.values(layers).map(v => (
          <Sprite
            image={plant}
            interactive
            anchor={0.5}
            x={seconds < finalSeconds ? seconds : finalSeconds}
            y={v.y}
            width={30}
            height={30}
            mouseover={e => {
              setSelection(v.kingdom || v.class);
            }}
            mouseout={e => {
              setSelection(undefined);
            }}
          />
        ))}
        {squares.map(d => (
          <Specie
            key={d.name}
            image={getImage(d.speciesClassName, d.kingdomName)}
            d={d}
            y={getY(d.speciesClassName, d.kingdomName)}
            finalY={480}
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
