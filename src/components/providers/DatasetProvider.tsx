import {
  ReactNode,
  RefObject,
  createContext,
  createRef,
  useCallback,
  useContext,
  useMemo,
} from "react";
import {
  InternMap,
  ScaleSequential,
  group,
  interpolateYlOrRd,
  scaleSequential,
} from "d3";
import useDataset from "../../hooks/useDataset";
import Dataset from "../../interfaces/Dataset";
import useCode from "../../hooks/useCode";

interface DatasetProviderProps {
  children: ReactNode | undefined;
  recordedInterval: number[];
  nodataInterval: string[];
}

interface DatasetContextProps {
  rowByNumericCodes: Map<number, Map<string, Dataset>> | undefined;
  datasetIntervals: Map<number, Map<number, Set<string>>> | undefined;
  numericCodeByAlphaCode: Map<string, string> | undefined;
  alphaCodeByNumericCode: Map<string, string> | undefined;
  isLoading: boolean;
  isError: boolean;
  allDatasetNumericCountryCodes: Set<string> | undefined;
  recordedInterval: number[];
  nodataInterval: string[];
  scaleColor: ScaleSequential<string, never>;
  colorBarsRefs: RefObject<SVGPolygonElement>[];
  nodataRef: RefObject<SVGPolygonElement>;
  getIntervalByAids: (aids: number) => [number, number];
  groupedDatasetByCode: InternMap<string, Dataset[]> | undefined;
}

const DatasetContext = createContext<DatasetContextProps>({
  rowByNumericCodes: undefined,
  datasetIntervals: undefined,
  numericCodeByAlphaCode: undefined,
  alphaCodeByNumericCode: undefined,
  isLoading: true,
  isError: false,
  allDatasetNumericCountryCodes: undefined,
  recordedInterval: [],
  nodataInterval: [],
  scaleColor: ((n: number) => {}) as ScaleSequential<string, never>,
  colorBarsRefs: [],
  nodataRef: {} as RefObject<SVGPolygonElement>,
  getIntervalByAids: () => [-Infinity, Infinity],
  groupedDatasetByCode: undefined,
});

export default function DatasetProvider(props: DatasetProviderProps) {
  const { children, recordedInterval, nodataInterval } = props;
  const { dataset, isLoading, isError } = useDataset();
  const { codes } = useCode();

  const groupedDatasetByYear = useMemo(
    () => dataset && group(dataset, (dataset) => dataset.Year),
    [dataset]
  );

  const groupedDatasetByCode = useMemo(() => {
    const map = dataset && group(dataset, (dataset) => dataset.Code);
    map?.delete("");
    return map;
  }, [dataset]);

  const numericCodeByAlphaCode = useMemo(
    () =>
      codes &&
      new Map<string, string>(
        codes.map((code) => [code["alpha-3"], code["country-code"]])
      ),
    [codes]
  );

  const alphaCodeByNumericCode = useMemo(
    () =>
      codes &&
      new Map<string, string>(
        codes.map((code) => [code["country-code"], code["alpha-3"]])
      ),
    [codes]
  );

  const rowByNumericCodes = useMemo(() => {
    if (!groupedDatasetByYear || !numericCodeByAlphaCode) return;
    const map = new Map<number, Map<string, Dataset>>();
    groupedDatasetByYear.forEach((dataset, year) => {
      const rowByNumericCode = new Map(
        dataset.map((row) => {
          const alphaCode = row.Code;
          const numericCode = numericCodeByAlphaCode.get(alphaCode);
          return [numericCode, row];
        })
      );
      rowByNumericCode.delete(undefined);
      map.set(year, rowByNumericCode as Map<string, Dataset>);
    });
    return map;
  }, [groupedDatasetByYear, numericCodeByAlphaCode]);

  const datasetIntervals = useMemo(() => {
    if (!groupedDatasetByYear) return;
    const map = new Map<number, Map<number, Set<string>>>();
    groupedDatasetByYear.forEach((dataset, year) => {
      const datasetInterval = new Map<number, Set<string>>();
      for (let i = 0; i < recordedInterval.length; i++) {
        const start = recordedInterval[i];
        const end =
          i === recordedInterval.length - 1
            ? Infinity
            : recordedInterval[i + 1];
        const countryAlphaCodes = new Set<string>();
        dataset.forEach((row) => {
          const aids =
            row[
              "Prevalence - HIV/AIDS - Sex: Both - Age: 15-49 years (Percent)"
            ];
          if (aids >= start && aids <= end) countryAlphaCodes.add(row.Code);
        });
        datasetInterval.set(recordedInterval[i], countryAlphaCodes);
      }
      map.set(year, datasetInterval);
    });
    return map;
  }, [groupedDatasetByYear, recordedInterval]);

  const allDatasetNumericCountryCodes = useMemo(() => {
    if (!groupedDatasetByYear || !numericCodeByAlphaCode) return;
    const set = new Set<string>();
    for (const [year, dataset] of groupedDatasetByYear) {
      dataset.forEach(({ Code }) => {
        const numericCode = numericCodeByAlphaCode?.get(Code);
        numericCode && set.add(numericCode);
      });
      break;
    }
    return set;
  }, [groupedDatasetByYear, numericCodeByAlphaCode]);

  const scaleColor = useMemo(
    () =>
      scaleSequential(interpolateYlOrRd).domain([
        recordedInterval[0],
        recordedInterval[recordedInterval.length - 1],
      ]),
    [recordedInterval]
  );

  const colorBarsRefs = useMemo(
    () => recordedInterval.map(() => createRef<SVGPolygonElement>()),
    [recordedInterval]
  );

  const nodataRef = useMemo(() => createRef<SVGPolygonElement>(), []);

  const getIntervalByAids = useCallback(
    (aids: number): [number, number] => {
      for (let i = 0; i < recordedInterval.length; i++) {
        const start = recordedInterval[i];
        const end = recordedInterval[i + 1] ?? Infinity;
        if (aids >= start && aids <= end) {
          return [i, i + 1];
        }
      }
      return [-Infinity, Infinity];
    },
    [recordedInterval]
  );

  return (
    <DatasetContext.Provider
      value={{
        rowByNumericCodes,
        numericCodeByAlphaCode,
        alphaCodeByNumericCode,
        isError,
        isLoading,
        datasetIntervals,
        allDatasetNumericCountryCodes,
        recordedInterval,
        nodataInterval,
        scaleColor,
        colorBarsRefs,
        nodataRef,
        getIntervalByAids,
        groupedDatasetByCode,
      }}
    >
      {children}
    </DatasetContext.Provider>
  );
}

export function useDatasetContext() {
  return useContext<DatasetContextProps>(DatasetContext);
}
