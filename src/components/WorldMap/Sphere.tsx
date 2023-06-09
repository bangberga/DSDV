import { styled } from "styled-components";
import { useWorldMapContext } from "../providers/WorldMapProider";

export default function Sphere() {
  const { path } = useWorldMapContext();

  return <PathWrapper d={path({ type: "Sphere" })!} />;
}

const PathWrapper = styled.path`
  fill: #fbfbfb;
`;
