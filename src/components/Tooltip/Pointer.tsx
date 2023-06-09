import { useTooltipContext } from "../providers/TooltipProvider";
import { useYearContext } from "../providers/YearProvider";

export default function () {
  const { xScale, yScale, innerHeight, titleHeight, aidsByYear, scaleColor } =
    useTooltipContext();
  const { year } = useYearContext();

  if (!xScale || !yScale || !scaleColor || !aidsByYear) return <></>;

  const xScaleValue = xScale(year);
  const aids = aidsByYear.get(year) || 0;

  return (
    <>
      <line
        className="light-line"
        x1={xScaleValue}
        x2={xScaleValue}
        y1={0}
        y2={innerHeight - titleHeight}
      />
      <circle
        cx={xScaleValue}
        cy={yScale(aids)}
        r={6}
        stroke="white"
        strokeWidth={0.5}
        fill={scaleColor(aids)}
      />
    </>
  );
}
