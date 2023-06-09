import Error from "../Error";
import Features from "./Features";
import Boundary from "./Boundary";
import { styled } from "styled-components";
import Loading from "../Loading";
import Sphere from "./Sphere";
import ColorLegend from "./ColorLegend";
import { useWorldMapContext } from "../providers/WorldMapProider";

export default function WorldMap() {
  const { width, height, isError, isLoading, show } = useWorldMapContext();

  if (isLoading) return <Loading width={width} height={height} />;
  if (isError) return <Error />;

  return (
    <SVGWrapper width={width} height={height} show={"" + show}>
      <Sphere />
      <Features />
      <Boundary />
      <ColorLegend />
    </SVGWrapper>
  );
}

const SVGWrapper = styled.svg<{ show: string }>`
  display: ${({ show }) => (show === "true" ? "block" : "none")};
`;
