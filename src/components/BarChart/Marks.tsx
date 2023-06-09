import { memo } from "react";
import { InternMap, ScaleBand, ScaleLinear } from "d3";
import { styled } from "styled-components";
import { useLineChartContext } from "../providers/LineChartProvider";
import Dataset from "../../interfaces/Dataset";

export default function () {
  const {
    gScale,
    yValue,
    gValue,
    countryCodes,
    bScale,
    groupedSelectedDatasetByCode,
  } = useLineChartContext();

  return (
    <MemoizedMarks
      countryCodes={countryCodes}
      yScale={gScale}
      yValue={gValue}
      xScale={bScale}
      xValue={yValue}
      groupedSelectedDatasetByCode={groupedSelectedDatasetByCode}
    />
  );
}

interface MemoizedMarksProps {
  countryCodes: string[];
  yScale: ScaleBand<string>;
  yValue: (d: Dataset) => string;
  xScale: ScaleLinear<number, number, never>;
  xValue: (d: Dataset) => number;
  groupedSelectedDatasetByCode: InternMap<string, Dataset[]>;
}

const MemoizedMarks = memo(function (props: MemoizedMarksProps) {
  const {
    countryCodes,
    yScale,
    yValue,
    xScale,
    xValue,
    groupedSelectedDatasetByCode,
  } = props;

  return (
    <Wrapper>
      {countryCodes.map((code) => {
        const dataset = groupedSelectedDatasetByCode.get(code)![0];
        const width = xScale(xValue(dataset));
        return (
          <g key={code} transform={`translate(0,${yScale(yValue(dataset))})`}>
            <rect width={width} height={yScale.bandwidth()} />
            <text y={yScale.bandwidth() / 2} x={width + 5}>
              {xValue(dataset).toString().slice(0, 5)}%
            </text>
          </g>
        );
      })}
    </Wrapper>
  );
});

const Wrapper = styled.g`
  text {
    text-anchor: start;
  }
  rect {
    fill: #137b80;
  }
`;
