import { useTooltipContext } from "../providers/TooltipProvider";

export default function () {
  const { xScale, innerHeight, marksWidth, titleHeight } = useTooltipContext();

  if (!xScale) return <></>;

  const [minYear, maxYear] = xScale.domain();

  return (
    <>
      <g transform={`translate(0, ${innerHeight - titleHeight + 10})`}>
        <text className="text-axis" style={{ textAnchor: "start" }}>
          {minYear}
        </text>
        <text
          className="text-axis"
          x={marksWidth}
          style={{ textAnchor: "end" }}
        >
          {maxYear}
        </text>
      </g>
      <line x2={marksWidth} className="dash-line light-line" />
      <line
        x2={marksWidth}
        y1={innerHeight - titleHeight}
        y2={innerHeight - titleHeight}
        className="dash-line dark-line"
      />
      <line
        y1={innerHeight - titleHeight - 3}
        y2={innerHeight - titleHeight + 3}
        className="dark-line"
      />
      <line
        x1={marksWidth}
        x2={marksWidth}
        y1={innerHeight - titleHeight - 3}
        y2={innerHeight - titleHeight + 3}
        className="dark-line"
      />
    </>
  );
}
