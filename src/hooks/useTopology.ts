import { useQuery } from "@tanstack/react-query";
import { json } from "d3";
import { Topology, Objects } from "topojson-specification";

const jsonUrl = new URL(
  "https://unpkg.com/world-atlas@2.0.2/countries-50m.json"
);

export default function useWorldAtlas() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["topology"],
    queryFn: () => json<Topology<Objects<{}>>>(jsonUrl.href),
  });

  return { topology: data, isLoading, isError };
}
