import { useLayoutEffect, useRef } from "react";
import { useTooltipContext } from "../providers/TooltipProvider";

export default function () {
  const { yScale, innerHeight, setAxisLeftWidth, titleHeight } =
    useTooltipContext();
  const axisLeftRef = useRef<SVGGElement>(null);

  useLayoutEffect(() => {
    const dom = axisLeftRef.current;
    if (!dom) return;
    const axisLeftWidth = dom.getBBox().width;
    setAxisLeftWidth(axisLeftWidth);
  }, [axisLeftRef.current]);

  if (!yScale) return <></>;

  const [minAid, maxAid] = yScale.domain();

  return (
    <g ref={axisLeftRef}>
      <text className="text-axis">{maxAid}%</text>
      <text
        className="text-axis"
        transform={`translate(0, ${innerHeight - titleHeight})`}
      >
        {minAid}%
      </text>
    </g>
  );
}
