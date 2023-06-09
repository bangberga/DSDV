import { styled } from "styled-components";
import { useTooltipContext } from "../providers/TooltipProvider";
import { useYearContext } from "../providers/YearProvider";

export default function () {
  const { dataset, innerWidth, innerHeight } = useTooltipContext();
  const { year } = useYearContext();

  if (dataset) return <></>;

  return (
    <TextWrapper y={innerHeight / 3}>
      <tspan x={innerWidth / 2}>No data</tspan>
      <tspan x={innerWidth / 2} dy={20}>
        in {year}
      </tspan>
    </TextWrapper>
  );
}

const TextWrapper = styled.text`
  text-anchor: middle;
  tspan:first-child {
    fill: grey;
    font-size: 1.2rem;
    stroke: grey;
    stroke-width: 1.2;
  }
  tspan:last-child {
    fill: black;
    stroke: black;
    stroke-width: 0.5;
  }
`;
