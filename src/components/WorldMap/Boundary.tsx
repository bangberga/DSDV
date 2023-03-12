import { useWorldMapContext } from "../providers/WorldMapProider";

export default function Boundary() {
  const { interiors, outeriors, path } = useWorldMapContext();

  if (!interiors || !outeriors || !path) return <></>;

  return (
    <>
      <path d={path(interiors)!} className="boundary" />
      <path d={path(outeriors)!} className="boundary" />
    </>
  );
}
