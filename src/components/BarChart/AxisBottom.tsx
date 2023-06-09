import { memo } from "react";
import { ScaleLinear } from "d3";
import { styled } from "styled-components";
import { useLineChartContext } from "../providers/LineChartProvider";

export default function () {
  const { bScale, innerHeight, xAxisOffset } = useLineChartContext();

  return (
    <MemoizedAxisBottom
      xScale={bScale}
      innerHeight={innerHeight}
      xAxisOffset={xAxisOffset}
    />
  );
}

interface MemoizedAxisBottomProps {
  xScale: ScaleLinear<number, number, never>;
  innerHeight: number;
  xAxisOffset: number;
}

const MemoizedAxisBottom = memo(function (props: MemoizedAxisBottomProps) {
  const { xScale, innerHeight, xAxisOffset } = props;
  let ticks = xScale.ticks();
  const desiredTicks = 6;
  if (ticks.length >= 10) {
    ticks = xScale.ticks(desiredTicks);
  }

  return (
    <Wrapper>
      {ticks.map((tick, i) => {
        return (
          <g key={i} transform={`translate(${xScale(tick)},0)`}>
            <line y2={innerHeight} />
            <text y={xAxisOffset + innerHeight}>{tick}%</text>
          </g>
        );
      })}
    </Wrapper>
  );
});

const Wrapper = styled.g`
  line {
    stroke: lightgrey;
    stroke-dasharray: 4, 4;
  }
  g:first-of-type text {
    text-anchor: start;
  }
`;
