import {
  createContext,
  ReactNode,
  useContext,
  useCallback,
  useMemo,
  useState,
  createRef,
  RefObject,
  MouseEvent,
  useEffect,
} from "react";
import {
  InternMap,
  ScaleBand,
  ScaleLinear,
  bisector,
  extent,
  group,
  max,
  scaleBand,
  scaleLinear,
} from "d3";
import { Margin } from "../../types/Dimensions";
import { useDatasetContext } from "./DatasetProvider";
import Dataset, { FilteredKeyDataset } from "../../interfaces/Dataset";
import { generateColors, getRandomItems } from "../../utils";

interface LineChartProviderProps {
  children: ReactNode | undefined;
  width: number;
  height: number;
  margin: Margin;
  x: FilteredKeyDataset<number>;
  y: FilteredKeyDataset<number>;
  g: FilteredKeyDataset<string>;
  xAxisOffset?: number;
  yAxisOffset?: number;
}

const defaultLineChartProviderProps = {
  xAxisOffet: 15,
  yAxisOffset: 5,
};

interface LineChartContextProps {
  width: number;
  height: number;
  margin: Margin;
  innerWidth: number;
  innerHeight: number;
  countryCodes: string[];
  xValue: (d: Dataset) => number;
  yValue: (d: Dataset) => number;
  gValue: (d: Dataset) => string;
  xScale: ScaleLinear<number, number, never>;
  yScale: ScaleLinear<number, number, never>;
  gScale: ScaleBand<string>;
  bScale: ScaleLinear<number, number, never>;
  xAxisOffset: number;
  yAxisOffset: number;
  colorByCountryCode: Map<string, string> | undefined;
  lineRefs: Map<string, RefObject<SVGGElement>>;
  planeRef: RefObject<SVGRectElement>;
  legendRefs: Map<string, RefObject<SVGGElement>>;
  pointerRefs: Map<string, RefObject<SVGCircleElement>>;
  highlight: (e: MouseEvent<SVGTextElement, globalThis.MouseEvent>) => void;
  unhighilight: () => void;
  mousemove: (e: MouseEvent<SVGRectElement, globalThis.MouseEvent>) => void;
  mouseenter: () => void;
  mouseleave: () => void;
  index: number;
  year: number;
  showTooltip: boolean;
  addCountry: (countryCode: string) => void;
  removeCountry: (countryCode: string) => void;
  clearCountries: () => void;
  range: [number, number];
  groupedSelectedDatasetByCode: InternMap<string, Dataset[]>;
  handleRange: (range: [number, number]) => void;
  show: boolean;
  openLineChart: () => void;
  closeLineChart: () => void;
  showTable: boolean;
  openTable: () => void;
  closeTable: () => void;
}

const LineChartContext = createContext<LineChartContextProps>({
  width: 0,
  height: 0,
  margin: {} as Margin,
  innerWidth: 0,
  innerHeight: 0,
  countryCodes: [],
  xValue: () => 0,
  yValue: () => 0,
  gValue: () => "",
  xScale: {} as ScaleLinear<number, number, never>,
  yScale: {} as ScaleLinear<number, number, never>,
  gScale: {} as ScaleBand<string>,
  bScale: {} as ScaleLinear<number, number, never>,
  xAxisOffset: 0,
  yAxisOffset: 0,
  colorByCountryCode: undefined,
  lineRefs: new Map(),
  planeRef: {} as RefObject<SVGRectElement>,
  legendRefs: new Map(),
  pointerRefs: new Map(),
  highlight: () => {},
  unhighilight: () => {},
  mousemove: () => {},
  mouseenter: () => {},
  mouseleave: () => {},
  index: 0,
  year: 0,
  showTooltip: false,
  addCountry: () => {},
  removeCountry: () => {},
  clearCountries: () => {},
  range: [0, 0],
  groupedSelectedDatasetByCode: new Map(),
  handleRange: () => {},
  show: true,
  openLineChart: () => {},
  closeLineChart: () => {},
  showTable: false,
  openTable: () => {},
  closeTable: () => {},
});

export default function (props: LineChartProviderProps) {
  const { children, width, height, margin, x, y, g, xAxisOffset, yAxisOffset } =
    props;
  const { groupedDatasetByCode } = useDatasetContext();
  const [countryCodes, setCountryCodes] = useState<string[]>([]);
  const [range, setRange] = useState<[number, number]>([1990, 1990]);
  const [index, setIndex] = useState<number>(0);
  const [year, setYear] = useState<number>(1990);
  const [show, setShow] = useState<boolean>(false);
  const [showTable, setShowTable] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  const planeRef = useMemo(() => createRef<SVGRectElement>(), []);
  const legendRefs = useMemo(
    () => new Map(countryCodes.map((code) => [code, createRef<SVGGElement>()])),
    [countryCodes]
  );
  const pointerRefs = useMemo(
    () =>
      new Map(
        countryCodes.map((code) => [code, createRef<SVGCircleElement>()])
      ),
    [countryCodes]
  );

  const { left, bottom, right, top } = margin;
  const innerWidth = width - left - right;
  const innerHeight = height - top - bottom;

  const xValue = useCallback((d: Dataset) => d[x], [x]);
  const yValue = useCallback((d: Dataset) => d[y], [y]);
  const gValue = useCallback((d: Dataset) => d[g], [g]);

  const addCountry = useCallback((countryCode: string) => {
    setCountryCodes((prev) => [...prev, countryCode]);
  }, []);

  const removeCountry = useCallback((countryCode: string) => {
    setCountryCodes((prev) => prev.filter((code) => code !== countryCode));
  }, []);

  const clearCountries = useCallback(() => {
    setCountryCodes([]);
  }, []);

  const handleRange = useCallback((range: [number, number]) => {
    setRange(range);
  }, []);

  const openTable = useCallback(() => {
    setShowTable(true);
  }, []);

  const closeTable = useCallback(() => {
    setShowTable(false);
  }, []);

  const openLineChart = useCallback(() => {
    setShow(true);
  }, []);

  const closeLineChart = useCallback(() => {
    setShow(false);
  }, []);

  const selectedDataset = useMemo(() => {
    const selected: Dataset[] = [];
    countryCodes.forEach((code) => {
      const dataset = groupedDatasetByCode?.get(code);
      if (!dataset) return;
      selected.push(
        ...dataset.filter((d) => xValue(d) >= range[0] && xValue(d) <= range[1])
      );
    });
    return selected;
  }, [countryCodes, groupedDatasetByCode, xValue, range]);

  const groupedSelectedDatasetByCode = useMemo(
    () => group(selectedDataset, gValue),
    [selectedDataset, gValue]
  );

  const xScale = useMemo(() => {
    const [start, end] = extent(selectedDataset, xValue);
    return scaleLinear()
      .domain([start || 0, end || 0])
      .range([0, innerWidth]);
  }, [selectedDataset, xValue, innerWidth]);

  const yScale = useMemo(() => {
    return scaleLinear()
      .domain([0, max(selectedDataset, yValue) || 0])
      .range([innerHeight, 0]);
  }, [selectedDataset, yValue, innerHeight]);

  const gScale = useMemo(() => {
    return scaleBand()
      .domain(Array.from(group(selectedDataset, gValue).keys()))
      .range([0, innerHeight])
      .padding(0.2);
  }, [selectedDataset, gValue, innerHeight]);

  const bScale = useMemo(() => {
    return scaleLinear()
      .domain([0, max(selectedDataset, yValue) || 0])
      .range([0, innerWidth]);
  }, [selectedDataset, yValue, innerWidth]);

  const bisect = bisector(xValue).left;

  const colorByCountryCode = useMemo(() => {
    if (!groupedDatasetByCode) return;
    const colors = generateColors(150, groupedDatasetByCode.size);
    const map = new Map<string, string>();
    let i = 0;
    for (const [code] of groupedDatasetByCode) map.set(code, colors[i++]);
    return map;
  }, [groupedDatasetByCode]);

  const lineRefs = useMemo(() => {
    return new Map(
      countryCodes.map((countryCode) => {
        return [countryCode, createRef<SVGGElement>()];
      })
    );
  }, [countryCodes]);

  const highlight = useCallback(
    (e: MouseEvent<SVGTextElement, globalThis.MouseEvent>) => {
      const countryCode = (e.target as SVGGElement).dataset
        .countrycode as string;
      lineRefs.forEach((ref, code) => {
        ref.current?.setAttribute(
          "opacity",
          countryCode === code ? "1" : "0.2"
        );
      });
      legendRefs.forEach((ref, code) => {
        ref.current?.setAttribute(
          "opacity",
          countryCode === code ? "1" : "0.2"
        );
      });
      pointerRefs.forEach((ref, code) => {
        ref.current?.setAttribute(
          "opacity",
          countryCode === code ? "1" : "0.2"
        );
      });
    },
    [lineRefs, legendRefs, pointerRefs]
  );

  const unhighilight = useCallback(() => {
    lineRefs.forEach((ref) => {
      ref.current?.setAttribute("opacity", "1");
    });
    legendRefs.forEach((ref) => {
      ref.current?.setAttribute("opacity", "1");
    });
    pointerRefs.forEach((ref) => {
      ref.current?.setAttribute("opacity", "1");
    });
  }, [lineRefs, legendRefs, pointerRefs]);

  const mousemove = useCallback(
    (e: MouseEvent<SVGRectElement, globalThis.MouseEvent>) => {
      if (!planeRef.current) return;
      const mouseX = e.clientX - planeRef.current.getBoundingClientRect().left;
      const x = xScale.invert(mouseX);
      setYear(x);
      const dataset = groupedDatasetByCode?.values().next().value ?? [];
      let i = bisect(dataset, x, 1);
      if (i >= dataset.length || i <= 0) return;
      if (i > 0) {
        const start = xScale(xValue(dataset[i - 1]));
        const end = xScale(xValue(dataset[i]));
        i = (mouseX - start) / (end - start) < 0.5 ? i - 1 : i;
      }
      setIndex(i);
    },
    [planeRef.current, xScale, groupedDatasetByCode, bisect, xValue]
  );

  const mouseenter = useCallback(() => {
    setShowTooltip(true);
  }, []);

  const mouseleave = useCallback(() => {
    setShowTooltip(false);
  }, []);

  useEffect(() => {
    if (!groupedDatasetByCode) return;
    setCountryCodes(getRandomItems(Array.from(groupedDatasetByCode.keys()), 4));
  }, [groupedDatasetByCode]);

  return (
    <LineChartContext.Provider
      value={{
        width,
        height,
        margin,
        innerWidth,
        innerHeight,
        countryCodes,
        xScale,
        yScale,
        gScale,
        bScale,
        xValue,
        yValue,
        gValue,
        xAxisOffset: xAxisOffset || defaultLineChartProviderProps.xAxisOffet,
        yAxisOffset: yAxisOffset || defaultLineChartProviderProps.yAxisOffset,
        colorByCountryCode,
        lineRefs,
        planeRef,
        legendRefs,
        pointerRefs,
        highlight,
        unhighilight,
        mousemove,
        mouseenter,
        mouseleave,
        index,
        year,
        showTooltip,
        addCountry,
        removeCountry,
        clearCountries,
        range,
        groupedSelectedDatasetByCode,
        handleRange,
        show,
        openLineChart,
        closeLineChart,
        showTable,
        openTable,
        closeTable,
      }}
    >
      {children}
    </LineChartContext.Provider>
  );
}

export function useLineChartContext() {
  return useContext<LineChartContextProps>(LineChartContext);
}
