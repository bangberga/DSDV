import { ReactNode, createContext, useContext, useMemo } from "react";
import {
  geoNaturalEarth1,
  GeoPath,
  geoPath,
  GeoPermissibleObjects,
  GeoProjection,
} from "d3";
import { MultiLineString, FeatureCollection, Geometry } from "geojson";
import { feature, mesh } from "topojson-client";
import useWorldAtlas from "../../hooks/useTopology";
import { Margin } from "../../types/Dimensions";

interface WorldMapProviderProps {
  children: ReactNode | undefined;
  object: string;
  width: number;
  height: number;
  margin: Margin;
}

interface WorldMapContextProps {
  featured: FeatureCollection<Geometry, {}>;
  interiors: MultiLineString | undefined;
  outeriors: MultiLineString | undefined;
  isLoading: boolean;
  isError: boolean;
  projection: GeoProjection | undefined;
  path: GeoPath<any, GeoPermissibleObjects> | undefined;
  width: number;
  height: number;
  margin: Margin;
  innerWidth: number;
  innerHeight: number;
}

const WorldMapContext = createContext<WorldMapContextProps>({
  featured: { type: "FeatureCollection", features: [] },
  interiors: undefined,
  outeriors: undefined,
  isLoading: true,
  isError: false,
  projection: undefined,
  path: undefined,
  width: 0,
  height: 0,
  innerWidth: 0,
  innerHeight: 0,
  margin: {} as Margin,
});

export default function WorldMapProvider(props: WorldMapProviderProps) {
  const { children, object, width, height, margin } = props;
  const { topology, isLoading, isError } = useWorldAtlas();

  const { left, bottom, right, top } = margin;
  const innerWidth = width - left - right;
  const innerHeight = height - top - bottom;

  const featured = useMemo(() => {
    if (topology) {
      const featured = feature(topology, topology.objects[object]);
      if (featured.type === "Feature") {
        return {
          type: "FeatureCollection",
          features: [featured],
        } as FeatureCollection<Geometry, {}>;
      }
      if (featured.type === "FeatureCollection") {
        return featured;
      }
    }
    return {
      type: "FeatureCollection",
      features: [],
    } as FeatureCollection<Geometry, {}>;
  }, [topology, object]);

  const interiors = useMemo(
    () =>
      topology && mesh(topology, topology.objects.countries, (a, b) => a !== b),
    [topology]
  );

  const outeriors = useMemo(
    () =>
      topology && mesh(topology, topology.objects.countries, (a, b) => a === b),
    [topology]
  );

  const projection = useMemo(
    () =>
      featured &&
      geoNaturalEarth1().fitExtent(
        [
          [0, 0],
          [innerWidth, innerHeight],
        ],
        featured
      ),
    [featured, innerWidth, innerHeight]
  );

  const path = useMemo(() => projection && geoPath(projection), [projection]);

  return (
    <WorldMapContext.Provider
      value={{
        featured,
        interiors,
        outeriors,
        projection,
        path,
        isError,
        isLoading,
        width,
        height,
        innerWidth,
        innerHeight,
        margin,
      }}
    >
      {children}
    </WorldMapContext.Provider>
  );
}

export function useWorldMapContext() {
  return useContext<WorldMapContextProps>(WorldMapContext);
}
