import { styled } from "styled-components";
import { useLineChartContext } from "../providers/LineChartProvider";
import AxisLeft from "./AxisLeft";
import AxisBottom from "./AxisBottom";
import Marks from "./Marks";

export default function BarChart() {
  const {
    width,
    height,
    margin: { left, top },
    countryCodes,
    range,
    show,
  } = useLineChartContext();

  if (range[0] !== range[1]) return <></>;

  if (countryCodes.length < 1)
    return (
      <Wrapper width={width} height={height} show={"" + show}>
        <p>No country selected</p>
      </Wrapper>
    );

  return (
    <SVGWrapper width={width} height={height} show={"" + show}>
      <g transform={`translate(${left}, ${top})`}>
        <AxisLeft />
        <AxisBottom />
        <Marks />
      </g>
    </SVGWrapper>
  );
}

const SVGWrapper = styled.svg<{ show: string }>`
  display: ${({ show }) => (show === "true" ? "block" : "none")};
  text {
    font-size: smaller;
  }
`;

const Wrapper = styled.div<{ width: number; height: number; show: string }>`
  display: ${({ show }) => (show === "true" ? "block" : "none")};
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
