import { useWorldMapContext } from "../providers/WorldMapProider";
import Error from "./Error";
import Features from "./Features";
import Boundary from "./Boundary";
import Loading from "./Loading";
import Sphere from "./Sphere";
import ColorLegend from "./ColorLegend";

export default function WorldMap() {
  const { isLoading, isError, width, height } = useWorldMapContext();

  if (isLoading) return <Loading />;
  if (isError) return <Error />;

  return (
    <svg width={width} height={height}>
      <Sphere />
      <Features />
      <Boundary />
      <ColorLegend />
    </svg>
  );
}
