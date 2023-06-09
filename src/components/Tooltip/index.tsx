import styled from "styled-components";
import { useTooltipContext } from "../providers/TooltipProvider";
import AxisBottom from "./AxisBottom";
import AxisLeft from "./AxisLeft";
import Marks from "./Marks";
import Pointer from "./Pointer";
import Information from "./Information";
import Title from "./Title";
import Nodata from "./Nodata";

export default function Tooltip() {
  const { data, width, height, margin, titleHeight, axisLeftWidth, position } =
    useTooltipContext();

  if (!data) return <></>;

  return (
    <SVGWrapper
      top={position.top + 20}
      left={position.left + 20}
      width={width}
      height={height}
    >
      <g transform={`translate(${margin.left},${margin.top})`}>
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

const SVGWrapper = styled.svg<{ top: number; left: number }>`
  position: absolute;
  top: ${({ top }) => top}px;
  left: ${({ left }) => left}px;
  background: #fff;
  box-shadow: 1px 1px 3px rgb(205, 205, 205);
  border-radius: 0.25rem;
  opacity: 0.9;
  pointer-events: none;
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
