import { createRef, useEffect, useMemo, useRef, RefObject, memo } from "react";
import { styled } from "styled-components";
import { useDatasetContext } from "../providers/DatasetProvider";
import { useLineChartContext } from "../providers/LineChartProvider";
import { useWorldMapContext } from "../providers/WorldMapProider";
import { InternMap } from "d3";
import Dataset from "../../interfaces/Dataset";

export default function () {
  const {
    legendRefs,
    countryCodes,
    colorByCountryCode,
    index,
    yValue,
    year,
    innerHeight,
    innerWidth,
    xScale,
    showTooltip,
  } = useLineChartContext();
  const { numericCodeByAlphaCode, groupedDatasetByCode } = useDatasetContext();
  const { contryNameById } = useWorldMapContext();

  const tooltipRef = useRef<SVGGElement>(null);
  const titleRef = useRef<SVGTextElement>(null);
  const rectRef = useRef<SVGRectElement>(null);
  const contentRef = useRef<SVGGElement>(null);
  const legendContentRefs = useMemo(
    () =>
      new Map(
        countryCodes.map((code) => {
          return [code, createRef<SVGGElement>()];
        })
      ),
    [countryCodes]
  );
  const aidsRefs = useMemo(
    () =>
      new Map(
        countryCodes.map((code) => {
          return [code, createRef<SVGTextElement>()];
        })
      ),
    [countryCodes]
  );

  useEffect(() => {
    if (!titleRef.current || !contentRef.current) return;
    const { height: titleHeight } = titleRef.current.getBoundingClientRect();
    titleRef.current.setAttribute("y", (titleHeight / 2).toString());
    contentRef.current.setAttribute(
      "transform",
      `translate(0, ${titleHeight + titleHeight / 2})`
    );
    const legendWidths = Array.from(legendContentRefs.values()).map(
      (ref) => ref.current?.getBoundingClientRect().width || 0
    );
    const legendHeights = Array.from(legendContentRefs.values()).map(
      (ref) => ref.current?.getBoundingClientRect().height || 0
    );
    let i = 0;
    legendRefs.forEach((ref) => {
      ref.current?.setAttribute(
        "transform",
        `translate(0, ${i * legendHeights[i++]})`
      );
    });

    const aidsWidths = Array.from(aidsRefs.values()).map(
      (ref) => ref.current?.getBoundingClientRect().width || 0
    );

    aidsRefs.forEach((ref) => {
      if (!ref.current) return;
      ref.current.setAttribute(
        "transform",
        `translate(${Math.max(...legendWidths) + 10}, 0)`
      );
    });
    if (!rectRef.current) return;
    rectRef.current.setAttribute(
      "width",
      (
        Math.max(...legendWidths) +
        Math.max(...aidsWidths) +
        10 + // margin left
        +10 + // offet legend
        10
      ).toString()
    );

    rectRef.current.setAttribute(
      "height",
      (
        legendHeights.reduce((prev, cur) => prev + cur, 0) +
        titleHeight +
        5 +
        5
      ).toString()
    );
  }, [
    titleRef.current,
    contentRef.current,
    legendRefs,
    legendContentRefs,
    aidsRefs,
    rectRef.current,
    year,
  ]);
  if (!groupedDatasetByCode || !numericCodeByAlphaCode) return <></>;

  const roundYear = +year.toFixed(0);
  const offsetTooltip = 5;
  let xPosition = xScale(roundYear) + offsetTooltip;
  if (tooltipRef.current) {
    const { width } = tooltipRef.current.getBoundingClientRect();
    if (xPosition + width > innerWidth) xPosition -= width + 2 * offsetTooltip;
  }

  return (
    <MemoizedTooltip
      aidsRefs={aidsRefs}
      colorByCountryCode={colorByCountryCode}
      contentRef={contentRef}
      contryNameById={contryNameById}
      countryCodes={countryCodes}
      index={index}
      groupedDatasetByCode={groupedDatasetByCode}
      innerHeight={innerHeight}
      legendContentRefs={legendContentRefs}
      legendRefs={legendRefs}
      numericCodeByAlphaCode={numericCodeByAlphaCode}
      rectRef={rectRef}
      roundYear={roundYear}
      titleRef={titleRef}
      tooltipRef={tooltipRef}
      xPosition={xPosition}
      yValue={yValue}
      showTooltip={showTooltip}
    />
  );
}

interface MemoizedTooltipProps {
  xPosition: number;
  innerHeight: number;
  tooltipRef: RefObject<SVGGElement>;
  rectRef: RefObject<SVGRectElement>;
  titleRef: RefObject<SVGTextElement>;
  roundYear: number;
  contentRef: RefObject<SVGGElement>;
  countryCodes: string[];
  groupedDatasetByCode: InternMap<string, Dataset[]>;
  legendRefs: Map<string, RefObject<SVGGElement>>;
  colorByCountryCode: Map<string, string> | undefined;
  legendContentRefs: Map<string, RefObject<SVGGElement>>;
  contryNameById: Map<string, string>;
  numericCodeByAlphaCode: Map<string, string>;
  aidsRefs: Map<string, RefObject<SVGTextElement>>;
  yValue: (d: Dataset) => number;
  index: number;
  showTooltip: boolean;
}

const MemoizedTooltip = memo(function (props: MemoizedTooltipProps) {
  const {
    aidsRefs,
    colorByCountryCode,
    contentRef,
    contryNameById,
    countryCodes,
    groupedDatasetByCode,
    innerHeight,
    legendContentRefs,
    legendRefs,
    numericCodeByAlphaCode,
    rectRef,
    roundYear,
    titleRef,
    tooltipRef,
    xPosition,
    yValue,
    index,
    showTooltip,
  } = props;

  if (!showTooltip) return <></>;

  return (
    <Wrapper
      transform={`translate(${xPosition}, ${innerHeight / 5})`}
      ref={tooltipRef}
    >
      <rect ref={rectRef} />
      <g transform="translate(10,5)">
        <text ref={titleRef}>{roundYear}</text>
        <g ref={contentRef}>
          {countryCodes.map((countryCode, i) => {
            const dataset = groupedDatasetByCode.get(countryCode);
            const data = dataset && dataset.at(index);
            return (
              <g
                key={countryCode}
                ref={legendRefs.get(countryCode)}
                fill={colorByCountryCode?.get(countryCode)}
              >
                <g ref={legendContentRefs.get(countryCode)}>
                  <circle cx={5} r={5} />
                  <text transform={`translate(15, 0)`}>
                    {contryNameById.get(
                      numericCodeByAlphaCode?.get(countryCode)!
                    ) || countryCode}
                  </text>
                </g>
                <text ref={aidsRefs.get(countryCode)}>
                  {data && yValue(data).toFixed(2)}%
                </text>
              </g>
            );
          })}
        </g>
      </g>
    </Wrapper>
  );
});

const Wrapper = styled.g`
  pointer-events: none;
  font-weight: bolder;
  text {
    text-anchor: start;
  }

  rect {
    opacity: 0.8;
    fill: white;
    stroke: black;
    stroke-width: 0.2;
  }
`;
