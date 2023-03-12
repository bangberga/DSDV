import { ScaleSequential, interpolateYlOrRd, scaleSequential } from "d3";
import {
  Dispatch,
  ReactNode,
  RefObject,
  SetStateAction,
  createContext,
  createRef,
  useContext,
  useMemo,
  useState,
} from "react";
import FilteredInterval from "../../interfaces/FilteredInterval";

interface ColorLegendProviderProps {
  children: ReactNode | undefined;
  nodataColor: string;
  strokeWidth: number;
  widthPercent: number;
  colorLegendHeight: number;
  colorLegendOffsetHeight: number;
  colorLegendOffsetText: number;
  spacing: number;
  strokeBold: number;
}

interface ColorLegendContextProps {
  recordedInterval: number[];
  recordedIntervalIndex: number[];
  nodataInterval: string[];
  nodataIntervalIndex: string[];
  scaleColor: ScaleSequential<string, never>;
  nodataColor: string;
  filteredInterval: FilteredInterval;
  setFilteredInterval: Dispatch<SetStateAction<FilteredInterval>>;
  colorBarsRefs: RefObject<SVGPolygonElement>[];
  nodataRef: RefObject<SVGPolygonElement>;
  strokeWidth: number;
  widthPercent: number;
  colorLegendHeight: number;
  colorLegendOffsetHeight: number;
  colorLegendOffsetText: number;
  spacing: number;
  strokeBold: number;
}

const ColorLegendContext = createContext<ColorLegendContextProps>({
  recordedInterval: [],
  recordedIntervalIndex: [],
  nodataInterval: [],
  nodataIntervalIndex: [],
  scaleColor: ((n: number) => {}) as ScaleSequential<string, never>,
  nodataColor: "white",
  filteredInterval: { cur: null, prev: null },
  setFilteredInterval: () => {},
  colorBarsRefs: [],
  nodataRef: {} as RefObject<SVGPolygonElement>,
  strokeWidth: 0,
  widthPercent: 0,
  colorLegendHeight: 0,
  colorLegendOffsetHeight: 0,
  colorLegendOffsetText: 0,
  spacing: 0,
  strokeBold: 0,
});

export default function ColorLegendProvider(props: ColorLegendProviderProps) {
  const {
    children,
    nodataColor,
    strokeWidth,
    widthPercent,
    colorLegendHeight,
    colorLegendOffsetText,
    colorLegendOffsetHeight,
    spacing,
    strokeBold,
  } = props;
  const [filteredInterval, setFilteredInterval] = useState<FilteredInterval>({
    cur: null,
    prev: null,
  });

  const recordedInterval = useMemo(
    () => [0, 0.5, 1, 2.5, 5, 7.5, 10, 12.5, 15, 17],
    []
  );

  const recordedIntervalIndex = useMemo(
    () => Array.from(Array(recordedInterval.length).keys()),
    [recordedInterval]
  );

  const nodataInterval = useMemo(() => ["No data"], []);

  const nodataIntervalIndex = useMemo(() => ["NODATA"], []);

  const scaleColor = useMemo(
    () => scaleSequential(interpolateYlOrRd).domain([0, 17]),
    []
  );

  const colorBarsRefs = useMemo(
    () => recordedInterval.map(() => createRef<SVGPolygonElement>()),
    [recordedInterval]
  );

  const nodataRef = useMemo(() => createRef<SVGPolygonElement>(), []);

  return (
    <ColorLegendContext.Provider
      value={{
        recordedInterval,
        recordedIntervalIndex,
        nodataInterval,
        nodataIntervalIndex,
        scaleColor,
        nodataColor,
        filteredInterval,
        setFilteredInterval,
        colorBarsRefs,
        nodataRef,
        strokeWidth,
        widthPercent,
        colorLegendHeight,
        colorLegendOffsetHeight,
        colorLegendOffsetText,
        spacing,
        strokeBold,
      }}
    >
      {children}
    </ColorLegendContext.Provider>
  );
}

export function useColorLegendContext() {
  return useContext<ColorLegendContextProps>(ColorLegendContext);
}
