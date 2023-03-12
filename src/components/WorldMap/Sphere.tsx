import { useWorldMapContext } from "../providers/WorldMapProider";

export default function Sphere() {
  const { path } = useWorldMapContext();

  if (!path) return <></>;

  return <path d={path({ type: "Sphere" })!} fill="#fbfbfb" />;
}
