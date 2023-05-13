import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { Margin } from "../../types/Dimensions";
import { useDatasetContext } from "./DatasetProvider";
import {
  ScaleLinear,
  ScaleSequential,
  extent,
  interpolateYlOrRd,
  max,
  scaleLinear,
  scaleSequential,
} from "d3";
import Dataset, { FilterKeysDataset } from "../../interfaces/Dataset";

interface LineChartProviderProps {
  children: ReactNode | undefined;
  width: number;
  height: number;
  margin: Margin;
  x: FilterKeysDataset<number>;
  y: FilterKeysDataset<number>;
}

interface LineChartContextProps {
  width: number;
  height: number;
  margin: Margin;
  innerWidth: number;
  innerHeight: number;
  data: Data | null;
  dataset: Dataset[] | undefined;
  xValue: (dataset: Dataset) => number;
  yValue: (dataset: Dataset) => number;
  xScale: ScaleLinear<number, number, never> | undefined;
  yScale: ScaleLinear<number, number, never> | undefined;
  scaleColor: ScaleSequential<string, never> | undefined;
  marksWidth: number;
  aidsByYear: Map<number, number> | undefined;
  titleHeight: number;
  axisLeftWidth: number;
  textHeight: number;
  informationWidth: number;
  informationHeight: number;
  setData: Dispatch<SetStateAction<Data | null>>;
  setTitleHeight: Dispatch<SetStateAction<number>>;
  setAxisLeftWidth: Dispatch<SetStateAction<number>>;
  setTextHeight: Dispatch<SetStateAction<number>>;
  setInformationWidth: Dispatch<SetStateAction<number>>;
  setInformationHeight: Dispatch<SetStateAction<number>>;
}

const LineChartContext = createContext<LineChartContextProps>({
  width: 0,
  height: 0,
  innerWidth: 0,
  innerHeight: 0,
  margin: {} as Margin,
  data: null,
  dataset: undefined,
  xValue: () => 0,
  yValue: () => 0,
  xScale: undefined,
  yScale: undefined,
  scaleColor: undefined,
  marksWidth: 0,
  aidsByYear: undefined,
  titleHeight: 0,
  axisLeftWidth: 0,
  textHeight: 0,
  informationWidth: 0,
  informationHeight: 0,
  setData: () => {},
  setAxisLeftWidth: () => {},
  setTitleHeight: () => {},
  setTextHeight: () => {},
  setInformationWidth: () => {},
  setInformationHeight: () => {},
});

type Data = { name: string | undefined; alphaCode: string | undefined };

export default function LineChartProvider(props: LineChartProviderProps) {
  const { width, height, margin, children, x, y } = props;
  const { countryGroupedDataset, scaleColor } = useDatasetContext();
  const [data, setData] = useState<Data | null>(null);
  const [titleHeight, setTitleHeight] = useState<number>(0);
  const [axisLeftWidth, setAxisLeftWidth] = useState<number>(0);
  const [textHeight, setTextHeight] = useState<number>(0);
  const [informationWidth, setInformationWidth] = useState<number>(0);
  const [informationHeight, setInformationHeight] = useState<number>(0);

  const dataset = useMemo(() => {
    if (!data || !data.alphaCode) return;
    return countryGroupedDataset?.get(data.alphaCode);
  }, [countryGroupedDataset, data]);

  const aidsByYear = useMemo(() => {
    if (!dataset) return;
    return new Map<number, number>(
      dataset.map(
        ({
          Year,
          "Prevalence - HIV/AIDS - Sex: Both - Age: 15-49 years (Percent)":
            aids,
        }) => [Year, aids]
      )
    );
  }, [dataset]);

  const { left, bottom, right, top } = margin;
  const innerWidth = useMemo(() => width - left - right, [width, left, right]);
  const innerHeight = useMemo(
    () => height - top - bottom,
    [height, top, bottom]
  );
  const marksWidth = useMemo(() => innerWidth * 0.75, [innerWidth]);

  const xValue = useCallback((dataset: Dataset) => dataset[x], [x]);
  const yValue = useCallback((dataset: Dataset) => dataset[y], [y]);

  const xScale = useMemo(() => {
    if (!dataset) return;
    const [start, end] = extent(dataset, xValue);
    return scaleLinear()
      .domain([start || 0, end || 0])
      .range([0, marksWidth]);
  }, [dataset, marksWidth, xValue]);

  const yScale = useMemo(() => {
    if (!dataset) return;
    return scaleLinear()
      .domain([0, max(dataset, yValue) || 0])
      .range([innerHeight - titleHeight, 0])
      .nice();
  }, [dataset, innerHeight, titleHeight, yValue]);

  const _scaleColor = useMemo(() => {
    if (!dataset) return;
    const domain = scaleColor.domain();
    return scaleSequential((d) => interpolateYlOrRd(d + 0.3)).domain(domain);
  }, [dataset, scaleColor]);

  return (
    <LineChartContext.Provider
      value={{
        width,
        height,
        innerWidth,
        innerHeight,
        margin,
        data,
        dataset,
        xValue,
        yValue,
        xScale,
        yScale,
        scaleColor: _scaleColor,
        marksWidth,
        aidsByYear,
        titleHeight,
        axisLeftWidth,
        textHeight,
        informationWidth,
        informationHeight,
        setData,
        setTitleHeight,
        setAxisLeftWidth,
        setTextHeight,
        setInformationWidth,
        setInformationHeight,
      }}
    >
      {children}
    </LineChartContext.Provider>
  );
}

export function useLineChartContext() {
  return useContext<LineChartContextProps>(LineChartContext);
}
