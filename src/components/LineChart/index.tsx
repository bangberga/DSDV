import styled from "styled-components";
import { useLineChartContext } from "../providers/LineChartProvider";
import AxisBottom from "./AxisBottom";
import AxisLeft from "./AxisLeft";
import Marks from "./Marks";
import Pointer from "./Pointer";
import Information from "./Information";
import Title from "./Title";
import Nodata from "./Nodata";

export default function LineChart() {
  const {
    data,
    width,
    height,
    margin: { left, top },
    titleHeight,
    axisLeftWidth,
  } = useLineChartContext();

  if (!data) return <></>;

  return (
    <SVGWrapper width={width} height={height}>
      <g transform={`translate(${left},${top})`}>
        <Title />
        <g transform={`translate(0, ${titleHeight})`}>
          <AxisLeft />
          <Nodata />
          <g transform={`translate(${axisLeftWidth / 2 + 5},0)`}>
            <AxisBottom />
            <Marks />
            <Pointer />N
          </g>
          T
        </g>
        <Information />
      </g>
    </SVGWrapper>
  );
}

const SVGWrapper = styled.svg`
  box-shadow: 1px 1px 3px rgb(205, 205, 205);
  border-radius: 0.25rem;
  opacity: 0.9;
  .text-axis {
    fill: black;
    font-size: 0.7rem;
    stroke: black;
    stroke-width: 0.4;
  }
  .dash-line {
    stroke-dasharray: 4, 2;
  }
  .dark-line {
    stroke: gray;
  }
  .light-line {
    stroke: lightgrey;
  }
`;
