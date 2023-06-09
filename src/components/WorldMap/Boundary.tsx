import { styled } from "styled-components";
import { useWorldMapContext } from "../providers/WorldMapProider";

export default function Boundary() {
  const { interiors, outeriors, path } = useWorldMapContext();

  return (
    <>
      {interiors && <PathWrapper d={path(interiors)!} />}
      {outeriors && <PathWrapper d={path(outeriors)!} />}
    </>
  );
}

const PathWrapper = styled.path`
  fill: none;
  stroke: black;
  stroke-width: 0.2;
`;
