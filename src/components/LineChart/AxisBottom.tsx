import { memo } from "react";
import { ScaleLinear } from "d3";
import { styled } from "styled-components";
import { useLineChartContext } from "../providers/LineChartProvider";

export default function () {
  const { xScale, innerHeight, xAxisOffset } = useLineChartContext();

  return (
    <MemoizedAxisBottom
      xScale={xScale}
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
  const [start, end] = xScale.domain();
  let ticks = xScale.ticks();
  ticks = ticks.filter((tick) => tick % 1 === 0);
  const desiredTicks = 6;
  if (ticks.length >= 10) {
    ticks = xScale.ticks(desiredTicks);
  }
  if (!ticks.includes(end)) {
    if (end - ticks.at(-1)! < 3) ticks[ticks.length - 1] = end;
    else ticks.push(end);
  }
  if (!ticks.includes(start)) {
    if (ticks.at(0)! - start < 3) ticks[0] = start;
    else ticks.unshift(start);
  }

  return (
    <Wrapper>
      <line y1={innerHeight} y2={innerHeight} x2={xScale.range()[1]} />
      {ticks.map((tick, i) => {
        return (
          <g key={i} transform={`translate(${xScale(tick)},${innerHeight})`}>
            <line y1={0} y2={5} />
            <text y={xAxisOffset}>{tick}</text>
          </g>
        );
      })}
    </Wrapper>
  );
});

const Wrapper = styled.g`
  line {
    stroke: grey;
  }
  g:first-of-type text {
    text-anchor: start;
  }
  g:last-of-type text {
    text-anchor: end;
  }
`;
