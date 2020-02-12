import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import { groupBy } from "lodash";
import "./chart.scss";
import Specie from './specie-pixi';
import { Stage } from '@inlet/react-pixi';

const width = 650;
const height = 400;
const boxHeight = 5;
const margin = { top: 20, right: 5, bottom: 20, left: 35 };

const NegativeBarChart = ({ data, setTooltip }) => {
  const [bars, changeBars] = useState([]);

  useEffect(() => {
    const groupedData = groupBy(data, "year");
    const extent = d3.extent(data, d => parseInt(d.year, 10));
    const xScale = d3
      .scaleTime()
      .domain(extent)
      .range([-margin.left, width - margin.right]);

    const yearCount = {};
    const bars = [];
    Object.entries(groupedData).forEach(d => {
      const [year, yearAnimals] = d;
      yearAnimals.forEach(animal => {
        const { name } = animal;

        yearCount[year] = yearCount[year] ? yearCount[year] + 1 : 1;
        if (year) {
          bars.push({
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
    changeBars(bars);
  }, [data]);

  const axisRef = useRef();

  useEffect(() => {
    const extent = d3.extent(data, d => parseInt(d.year, 10));
    const xScale = d3
      .scaleTime()
      .domain(extent)
      .range([0, width - margin.right]);
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
    // const extent = d3.extent(data, d => parseInt(d.year, 10));
    // const interval = setInterval(() => {
    //   if (seconds + extent[0] - 125 < extent[1]) {
    //     setSeconds(seconds => seconds + 1);
    //   }
    // }, 0.1);
    const interval = setInterval(() => {
      setSeconds(seconds => seconds + 1);
    }, 1);
    return () => clearInterval(interval);
  }, [seconds]);

  const shouldStart = x => seconds < x;
  return (
    <React.Fragment>
      <svg width={width} height={100}>
        <svg
          y={0}
          x={seconds - 250}
          viewBox="2000 0 25 2500"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g>
            <g id="svg_2">
              <path
                fill="#fff"
                fillRule="nonzero"
                d="m380.931122,199.998718c57.412323,4.336288 107.142853,-35.444366 111.79248,-88.799492c4.447479,-53.355095 -38.207611,-99.734406 -95.620148,-104.259202c-56.805878,-3.959202 -106.940613,35.821415 -111.186005,89.176468c-4.851776,52.978035 37.803223,99.734505 95.013672,103.882225"
              />
              <path
                fill="#fff"
                fillRule="nonzero"
                d="m321.060852,234.611603c20.232422,-11.633087 44.871979,-19.333817 72.316193,-17.36763c35.256592,2.293808 64.103088,20.153061 81.731476,41.944565l103.766602,168.269897l141.627625,79.79303c12.01947,7.537048 19.631714,19.825317 18.029236,33.260742c-2.003418,20.808533 -24.239075,36.373901 -49.679932,34.571655c-7.812561,-0.327759 -14.222778,-2.949219 -21.234131,-5.570862l-154.448364,-87.002258c-4.807739,-3.113037 -8.613861,-7.045349 -11.818909,-11.141571l-38.662231,-63.080658l-46.675049,167.77832l182.493347,176.29834c4.206848,5.407104 7.011292,11.796936 8.614014,18.186951l49.279114,212.83606c-0.400757,4.751587 0.400635,7.700745 0,11.469238c-2.804504,31.786133 -36.458496,54.724609 -74.720154,52.430786c-31.851196,-2.130249 -55.288757,-21.300049 -62.700806,-45.0578l-46.474731,-199.400635l-148.438568,-132.71521l-34.255127,129.274475c-1.201813,6.062317 -11.017456,18.842224 -13.822144,23.921509l-142.42894,196.287659c-14.022514,17.859192 -37.86097,29.328308 -64.904289,27.526062c-38.66221,-2.293823 -67.308291,-29.819824 -64.103123,-61.27832c0.801287,-8.847839 5.408707,-18.187012 9.415185,-24.576904l132.212481,-181.377747l110.377472,-399.784271l-72.115997,47.679199l-38.261475,142.382233c-5.20845,18.350647 -25.440887,33.26062 -49.279251,31.786072c-25.841438,-1.63855 -44.671715,-19.825317 -42.668499,-40.961609c0,-1.638306 0.4006,-3.276917 0.801243,-5.243103l45.272728,-165.975922c2.80455,-7.04541 7.412079,-13.435455 14.222923,-18.3508l206.532082,-136.811493z"
              />
            </g>
          </g>
        </svg>
        <g ref={axisRef} transform={`translate(0, ${margin.bottom})`} />
      </svg>
      <Stage width={width} height={height}>
        {bars.map(d => (
          <Specie
            key={d.name}
            d={d}
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
