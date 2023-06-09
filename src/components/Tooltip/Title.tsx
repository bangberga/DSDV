import { useLayoutEffect, useRef } from "react";
import { useTooltipContext } from "../providers/TooltipProvider";
import { styled } from "styled-components";

export default function () {
  const { data, innerWidth, setTitleHeight } = useTooltipContext();
  const titleRef = useRef<SVGTextElement>(null);

  useLayoutEffect(() => {
    const dom = titleRef.current;
    if (!dom) return;
    const titleHeight = dom.getBBox().height;
    setTitleHeight(titleHeight);
  }, [titleRef.current]);

  if (!data) return <></>;
  return (
    <TextWrapper ref={titleRef} transform={`translate(${innerWidth / 2}, 0)`}>
      {data.name}
    </TextWrapper>
  );
}

const TextWrapper = styled.text`
  stroke: black;
  stroke-width: 0.5;
`;
