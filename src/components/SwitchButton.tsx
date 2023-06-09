import { useState, useEffect, useCallback } from "react";
import { styled } from "styled-components";
import { useWorldMapContext } from "./providers/WorldMapProider";
import { useLineChartContext } from "./providers/LineChartProvider";

export default function () {
  const { openWorldMap, closeWorldMap, show: showMap } = useWorldMapContext();
  const {
    openLineChart,
    closeLineChart,
    show: showLine,
  } = useLineChartContext();

  const changeMap = useCallback(() => {
    closeLineChart();
    openWorldMap();
  }, [closeLineChart, openWorldMap]);

  const changeLine = useCallback(() => {
    closeWorldMap();
    openLineChart();
  }, [closeLineChart, openWorldMap]);

  return (
    <Wrapper>
      <button onClick={changeLine} className={showLine ? "active" : ""}>
        CHART
      </button>
      <button onClick={changeMap} className={showMap ? "active" : ""}>
        MAP
      </button>
    </Wrapper>
  );
}

const Wrapper = styled.footer`
  margin-top: 1rem;
  display: flex;
  column-gap: 0.5rem;
  button {
    font-weight: 600;
    padding: 5px 10px;
    border: none;
    background: transparent;
    cursor: pointer;
    &.active {
      border: none;
      color: dodgerblue;
      border-bottom: 3px solid dodgerblue;
    }
  }
`;
