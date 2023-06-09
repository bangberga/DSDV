import {
  ReactNode,
  RefObject,
  createContext,
  createRef,
  useContext,
  useMemo,
  useState,
  useCallback,
} from "react";
import {
  geoNaturalEarth1,
  GeoPath,
  geoPath,
  GeoPermissibleObjects,
  GeoProjection,
} from "d3";
import { MultiLineString } from "geojson";
import { feature, mesh } from "topojson-client";
import useWorldAtlas from "../../hooks/useTopology";
import { Margin } from "../../types/Dimensions";
import { Countries, Country } from "../../types/Country";

interface WorldMapProviderProps {
  children: ReactNode | undefined;
  object: string;
  width: number;
  height: number;
  margin: Margin;
}

interface WorldMapContextProps {
  countryRefs: {
    feature: Country;
    ref: RefObject<SVGPathElement>;
  }[];
  contryNameById: Map<string, string>;
  interiors: MultiLineString | undefined;
  outeriors: MultiLineString | undefined;
  isLoading: boolean;
  isError: boolean;
  projection: GeoProjection;
  path: GeoPath<any, GeoPermissibleObjects>;
  width: number;
  height: number;
  margin: Margin;
  innerWidth: number;
  innerHeight: number;
  show: boolean;
  openWorldMap: () => void;
  closeWorldMap: () => void;
}

const WorldMapContext = createContext<WorldMapContextProps>({
  countryRefs: [],
  contryNameById: new Map(),
  interiors: undefined,
  outeriors: undefined,
  isLoading: true,
  isError: false,
  projection: {} as GeoProjection,
  path: {} as GeoPath<any, GeoPermissibleObjects>,
  width: 0,
  height: 0,
  innerWidth: 0,
  innerHeight: 0,
  margin: {} as Margin,
  show: true,
  openWorldMap: () => {},
  closeWorldMap: () => {},
});

export default function WorldMapProvider(props: WorldMapProviderProps) {
  const { children, object, width, height, margin } = props;
  const { topology, isLoading, isError } = useWorldAtlas();
  const [show, setShow] = useState<boolean>(true);

  const { left, bottom, right, top } = margin;
  const innerWidth = width - left - right;
  const innerHeight = height - top - bottom;

  const openWorldMap = useCallback(() => {
    setShow(true);
  }, []);

  const closeWorldMap = useCallback(() => {
    setShow(false);
  }, []);
  const featured = useMemo(() => {
    if (topology) {
      const featured = feature<{ name: string }>(
        topology,
        topology.objects[object]
      );
      if (featured.type === "Feature") {
        return {
          type: "FeatureCollection",
          features: [featured],
        } satisfies Countries;
      }
      if (featured.type === "FeatureCollection") {
        return featured;
      }
    }
    return {
      type: "FeatureCollection",
      features: [],
    } satisfies Countries;
  }, [topology, object]);

  const contryNameById = useMemo(() => {
    return new Map<string, string>(
      featured.features.map(({ id, properties }) => {
        if (!id) return ["", ""];
        return [id.toString(), properties.name];
      })
    );
  }, [featured]);

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
        contryNameById,
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
        show,
        openWorldMap,
        closeWorldMap,
      }}
    >
      {children}
    </WorldMapContext.Provider>
  );
}

export function useWorldMapContext() {
  return useContext<WorldMapContextProps>(WorldMapContext);
}
