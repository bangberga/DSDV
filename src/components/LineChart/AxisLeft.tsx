import { memo } from "react";
import { ScaleLinear } from "d3";
import { styled } from "styled-components";
import { useLineChartContext } from "../providers/LineChartProvider";

export default function () {
  const { yScale, innerWidth, yAxisOffset } = useLineChartContext();

  return (
    <MemoizedAxisLeft
      innerWidth={innerWidth}
      yScale={yScale}
      yAxisOffset={yAxisOffset}
    />
  );
}

interface MemoizedAxisLeftProps {
  yScale: ScaleLinear<number, number, never>;
  yAxisOffset: number;
  innerWidth: number;
}

const MemoizedAxisLeft = memo(function (props: MemoizedAxisLeftProps) {
  const { yScale, yAxisOffset, innerWidth } = props;
  let ticks = yScale.ticks();
  const desiredTicks = 6;
  if (ticks.length >= 10) {
    ticks = yScale.ticks(desiredTicks);
  }

  return (
    <Wrapper>
      {ticks.map((tick, i) => {
        return (
          <g key={i} transform={`translate(0, ${yScale(tick)})`}>
            <text x={-yAxisOffset}>{tick}%</text>
            <line x2={innerWidth} />
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
  text {
    text-anchor: end;
  }
`;
