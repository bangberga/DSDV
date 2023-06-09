import { memo } from "react";
import { styled } from "styled-components";
import { useLineChartContext } from "../providers/LineChartProvider";
import { useDatasetContext } from "../providers/DatasetProvider";
import { useWorldMapContext } from "../providers/WorldMapProider";
import { InternMap, ScaleLinear } from "d3";
import Dataset from "../../interfaces/Dataset";

export default function () {
  const {
    colorByCountryCode,
    xScale,
    yScale,
    xValue,
    yValue,
    countryCodes,
    lineRefs,
    highlight,
    unhighilight,
    groupedSelectedDatasetByCode,
  } = useLineChartContext();
  const { numericCodeByAlphaCode } = useDatasetContext();
  const { contryNameById } = useWorldMapContext();

  const [start, end] = xScale.domain();

  return (
    <MemoizedMarks
      colorByCountryCode={colorByCountryCode}
      contryNameById={contryNameById}
      countryCodes={countryCodes}
      groupedDatasetByCode={groupedSelectedDatasetByCode}
      highlight={highlight}
      unhighilight={unhighilight}
      lineRefs={lineRefs}
      numericCodeByAlphaCode={numericCodeByAlphaCode}
      xScale={xScale}
      xValue={xValue}
      yScale={yScale}
      yValue={yValue}
      end={end}
    />
  );
}

interface MemoizedMarksProps {
  countryCodes: string[];
  groupedDatasetByCode: InternMap<string, Dataset[]>;
  colorByCountryCode: Map<string, string> | undefined;
  lineRefs: Map<string, React.RefObject<SVGGElement>>;
  xScale: ScaleLinear<number, number, never>;
  yScale: ScaleLinear<number, number, never>;
  xValue: (d: Dataset) => number;
  yValue: (d: Dataset) => number;
  highlight: (e: React.MouseEvent<SVGTextElement, MouseEvent>) => void;
  unhighilight: () => void;
  contryNameById: Map<string, string>;
  numericCodeByAlphaCode: Map<string, string> | undefined;
  end: number;
}

const MemoizedMarks = memo(function (props: MemoizedMarksProps) {
  const {
    colorByCountryCode,
    contryNameById,
    countryCodes,
    groupedDatasetByCode,
    highlight,
    lineRefs,
    numericCodeByAlphaCode,
    unhighilight,
    xScale,
    xValue,
    yScale,
    yValue,
    end,
  } = props;

  return (
    <Wrapper>
      {countryCodes.map((countryCode, i) => {
        const dataset = groupedDatasetByCode.get(countryCode);
        if (!dataset) return;
        const color = colorByCountryCode?.get(countryCode) ?? "black";
        const name =
          contryNameById.get(numericCodeByAlphaCode?.get(countryCode)!) ||
          countryCode;
        return (
          <g key={i} ref={lineRefs.get(countryCode)}>
            {dataset.map((d, i, a) => {
              const next = a[i + 1];
              return (
                <g key={i}>
                  <circle
                    r={2}
                    fill={color}
                    cx={xScale(xValue(d))}
                    cy={yScale(yValue(d))}
                  />
                  {next && xValue(d) < end && (
                    <line
                      x1={xScale(xValue(d))}
                      y1={yScale(yValue(d))}
                      x2={xScale(xValue(next))}
                      y2={yScale(yValue(next))}
                      stroke={color}
                      strokeWidth={1}
                    />
                  )}
                  {xValue(d) === end && (
                    <text
                      x={xScale(xValue(d)) + 5}
                      y={yScale(yValue(d))}
                      fill={color}
                      data-countrycode={countryCode}
                      onMouseOver={highlight}
                      onMouseLeave={unhighilight}
                    >
                      {name.length > 8 ? `${name.slice(0, 6)}...` : name}
                    </text>
                  )}
                </g>
              );
            })}
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
`;
