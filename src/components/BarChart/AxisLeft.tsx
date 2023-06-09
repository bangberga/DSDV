import { memo } from "react";
import { ScaleBand } from "d3";
import { styled } from "styled-components";
import { useLineChartContext } from "../providers/LineChartProvider";
import { useDatasetContext } from "../providers/DatasetProvider";
import { useWorldMapContext } from "../providers/WorldMapProider";

export default function () {
  const { yAxisOffset, gScale } = useLineChartContext();
  const { numericCodeByAlphaCode } = useDatasetContext();
  const { contryNameById } = useWorldMapContext();

  if (!numericCodeByAlphaCode) return <></>;

  return (
    <MemoizedAxisLeft
      yScale={gScale}
      yAxisOffset={yAxisOffset}
      numericCodeByAlphaCode={numericCodeByAlphaCode}
      contryNameById={contryNameById}
    />
  );
}

interface MemoizedAxisLeftProps {
  yScale: ScaleBand<string>;
  yAxisOffset: number;
  numericCodeByAlphaCode: Map<string, string>;
  contryNameById: Map<string, string>;
}

const MemoizedAxisLeft = memo(function (props: MemoizedAxisLeftProps) {
  const { yScale, yAxisOffset, numericCodeByAlphaCode, contryNameById } = props;
  let ticks = yScale.domain();

  return (
    <Wrapper>
      {ticks.map((tick, i) => {
        const name =
          contryNameById.get(numericCodeByAlphaCode.get(tick)!) || tick;
        return (
          <g key={i} transform={`translate(0, ${yScale(tick)})`}>
            <text x={-yAxisOffset} y={yScale.bandwidth() / 2}>
              {name.length > 8 ? `${name.slice(0, 8)}...` : name}
            </text>
          </g>
        );
      })}
    </Wrapper>
  );
});

const Wrapper = styled.g`
  g {
    text {
      text-anchor: end;
      font-weight: 600;
      font-size: 0.7rem;
    }
  }
`;
