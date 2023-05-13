import { useLayoutEffect, useRef } from "react";
import styled from "styled-components";
import { useLineChartContext } from "../providers/LineChartProvider";
import { useYearContext } from "../providers/YearProvider";

export default function () {
  const {
    aidsByYear,
    innerWidth,
    innerHeight,
    scaleColor,
    titleHeight,
    textHeight,
    setTextHeight,
    informationWidth,
    setInformationWidth,
    informationHeight,
    setInformationHeight,
  } = useLineChartContext();
  const { year } = useYearContext();

  const containerRef = useRef<SVGGElement>(null);
  const tspanRef = useRef<SVGTSpanElement>(null);

  useLayoutEffect(() => {
    if (tspanRef.current) {
      const textHeight = tspanRef.current.getBBox().height;
      setTextHeight(textHeight);
    }
    if (containerRef.current) {
      const containerHeight = containerRef.current.getBBox().height;
      const containerWidth = containerRef.current.getBBox().width;
      setInformationWidth(containerWidth);
      setInformationHeight(containerHeight);
    }
  }, [containerRef.current, tspanRef.current]);

  if (!aidsByYear || !scaleColor) return <></>;
  const aids = aidsByYear.get(year);

  return (
    <Wrapper
      transform={`translate(${-informationWidth / 2 + 10}, ${
        (innerHeight - titleHeight + informationHeight) / 2
      })`}
      ref={containerRef}
    >
      <text>
        {aids && (
          <tspan x={innerWidth} fill={scaleColor(aids)}>
            {aids.toFixed(2)}%
          </tspan>
        )}
        <tspan ref={tspanRef} dy={textHeight} x={innerWidth}>
          in {year}
        </tspan>
      </text>
    </Wrapper>
  );
}

const Wrapper = styled.g`
  text {
    text-anchor: start;
    tspan:first-child {
      font-size: 1rem;
      font-weight: bold;
    }
    tspan:last-child {
      font-size: 0.6rem;
      stroke: black;
      stroke-width: 0.4;
    }
  }
`;
