import React, { useState } from "react";
import "./app.css";
import data from "./extinct.json";
import NegativeBarChart from "./visualizations/NegativeBarChart";
import ErrorBoundary from "./ErrorBoundary";
import cx from "classnames";

const App = () => {
  const [tooltip, setTooltip] = useState({
    x: 0,
    y: 0,
    name: null,
    year: null,
    speciesClassName: null
  });
  return (
    <ErrorBoundary>
      <div className="app">
        <h1> Sixth extinction </h1>
        {tooltip.name && (
          <div
            className={cx('tooltip', { active: tooltip })}
            style={{ top: tooltip.y, left: tooltip.x - 50 }}
          >
            <p>{tooltip && tooltip.name}</p>
            <p>{tooltip && tooltip.year}</p>
            <p>{tooltip && tooltip.speciesClassName}</p>
          </div>
        )}
        <NegativeBarChart data={data} setTooltip={setTooltip} />
      </div>
    </ErrorBoundary>
  );
};

export default App;
