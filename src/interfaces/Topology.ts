import { Topology, Objects } from "topojson-specification";

export function instanceOfTopology(
  data: unknown
): data is Topology<Objects<{}>> {
  if (!data || typeof data !== "object") return false;
  return (
    "type" in data &&
    data.type === "Topology" &&
    "objects" in data &&
    typeof data.objects === "object" &&
    "arcs" in data &&
    Array.isArray(data.arcs)
  );
}
