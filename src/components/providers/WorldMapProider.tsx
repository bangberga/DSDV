import {
  ReactNode,
  RefObject,
  createContext,
  createRef,
  useContext,
  useMemo,
} from "react";
import {
  geoNaturalEarth1,
  GeoPath,
  geoPath,
  GeoPermissibleObjects,
  GeoProjection,
} from "d3";
import { MultiLineString, FeatureCollection, Geometry, Feature } from "geojson";
import { feature, mesh } from "topojson-client";
import useWorldAtlas from "../../hooks/useTopology";
import { Margin } from "../../types/Dimensions";

interface WorldMapProviderProps {
  children: ReactNode | undefined;
  object: string;
  width: number;
  height: number;
  margin: Margin;
  strokeBold: number;
  strokeWidth: number;
  blurOpacity: number;
}

interface WorldMapContextProps {
  countryRefs: {
    feature: Feature<Geometry, {}>;
    ref: RefObject<SVGPathElement>;
  }[];
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
  strokeBold: number;
  strokeWidth: number;
  blurOpacity: number;
}

const WorldMapContext = createContext<WorldMapContextProps>({
  countryRefs: [],
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
  strokeBold: 0,
  strokeWidth: 0,
  blurOpacity: 0,
});

export default function WorldMapProvider(props: WorldMapProviderProps) {
  const {
    children,
    object,
    width,
    height,
    margin,
    strokeBold,
    blurOpacity,
    strokeWidth,
  } = props;
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

  const countryRefs = useMemo(
    () =>
      featured.features.map((feature) => ({
        feature,
        ref: createRef<SVGPathElement>(),
      })),
    [featured]
  );

  return (
    <WorldMapContext.Provider
      value={{
        countryRefs,
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
        blurOpacity,
        strokeBold,
        strokeWidth,
      }}
    >
      {children}
    </WorldMapContext.Provider>
  );
}

export function useWorldMapContext() {
  return useContext<WorldMapContextProps>(WorldMapContext);
}
