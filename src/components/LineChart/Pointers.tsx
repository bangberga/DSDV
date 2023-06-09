import { memo } from "react";
import { InternMap, ScaleLinear } from "d3";
import { styled } from "styled-components";
import { useLineChartContext } from "../providers/LineChartProvider";
import { useDatasetContext } from "../providers/DatasetProvider";
import Dataset from "../../interfaces/Dataset";

export default function Pointers() {
  const {
    pointerRefs,
    countryCodes,
    year,
    xScale,
    innerHeight,
    yScale,
    index,
    yValue,
    colorByCountryCode,
    showTooltip,
  } = useLineChartContext();
  const { groupedDatasetByCode } = useDatasetContext();

  const roundYear = +year.toFixed(0);

  if (!groupedDatasetByCode) return <></>;

  return (
    <MemoizedPointers
      colorByCountryCode={colorByCountryCode}
      countryCodes={countryCodes}
      groupedDatasetByCode={groupedDatasetByCode}
      index={index}
      innerHeight={innerHeight}
      pointerRefs={pointerRefs}
      roundYear={roundYear}
      xScale={xScale}
      yScale={yScale}
      yValue={yValue}
      showTooltip={showTooltip}
    />
  );
}

interface MemoizedPointersProps {
  roundYear: number;
  index: number;
  xScale: ScaleLinear<number, number, never>;
  innerHeight: number;
  countryCodes: string[];
  groupedDatasetByCode: InternMap<string, Dataset[]>;
  pointerRefs: Map<string, React.RefObject<SVGCircleElement>>;
  yValue: (d: Dataset) => number;
  yScale: ScaleLinear<number, number, never>;
  colorByCountryCode: Map<string, string> | undefined;
  showTooltip: boolean;
}

const MemoizedPointers = memo(function (props: MemoizedPointersProps) {
  const {
    colorByCountryCode,
    countryCodes,
    groupedDatasetByCode,
    index,
    innerHeight,
    pointerRefs,
    roundYear,
    xScale,
    yScale,
    yValue,
    showTooltip,
  } = props;

  if (!showTooltip) return <></>;

  return (
    <Wrapper transform={`translate(${xScale(roundYear)},0)`}>
      <line y2={innerHeight} />
      <g>
        {countryCodes.map((countryCode) => {
          const dataset = groupedDatasetByCode.get(countryCode);
          const data = dataset && dataset.at(index);
          return (
            data && (
              <circle
                key={countryCode}
                ref={pointerRefs.get(countryCode)}
                cy={yScale(yValue(data))}
                fill={colorByCountryCode?.get(countryCode)}
                r={4}
              />
            )
          );
        })}
      </g>
    </Wrapper>
  );
});

const Wrapper = styled.g`
  pointer-events: none;
  line {
    stroke: lightgray;
  }
  circle {
    stroke: white;
    stroke-width: 0.5;
  }
`;
