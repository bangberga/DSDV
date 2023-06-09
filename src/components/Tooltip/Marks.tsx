import { useTooltipContext } from "../providers/TooltipProvider";

export default function () {
  const { xValue, yValue, xScale, yScale, dataset, scaleColor } =
    useTooltipContext();

  if (!xScale || !yScale || !scaleColor || !dataset) return <></>;

  return (
    <>
      {dataset.map((d, i, a) => {
        const next = a[i + 1];
        if (!next) return;
        return (
          <line
            key={i}
            x1={xScale(xValue(d))}
            y1={yScale(yValue(d))}
            x2={xScale(xValue(next))}
            y2={yScale(yValue(next))}
            stroke={scaleColor(yValue(d))}
            strokeWidth={3}
          />
        );
      })}
    </>
  );
}
