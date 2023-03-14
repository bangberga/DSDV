import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { group } from "d3";
import useDataset from "../../hooks/useDataset";
import Dataset from "../../interfaces/Dataset";
import useCode from "../../hooks/useCode";

interface DatasetProviderProps {
  children: ReactNode | undefined;
  initialYear: number;
  recordedInterval: number[];
}

interface DatasetContextProps {
  rowByNumericCode: Map<string | undefined, Dataset> | undefined;
  numericCodeByAlphaCode: Map<string, string> | undefined;
  alphaCodeByNumericCode: Map<string, string> | undefined;
  isLoading: boolean;
  isError: boolean;
  handleYear: (year: number) => void;
  datasetInterval: Map<number, Set<string>>;
  allDatasetNumericCountryCode: Set<string>;
}

const DatasetContext = createContext<DatasetContextProps>({
  rowByNumericCode: undefined,
  numericCodeByAlphaCode: undefined,
  alphaCodeByNumericCode: undefined,
  isLoading: true,
  isError: false,
  handleYear: (year: number) => {},
  datasetInterval: new Map(),
  allDatasetNumericCountryCode: new Set(),
});

export default function DatasetProvider(props: DatasetProviderProps) {
  const { children, recordedInterval } = props;
  const [year, setYear] = useState<number>(2019);
  const { dataset, isLoading, isError } = useDataset();
  const { codes } = useCode();

  const handleYear = useCallback((year: number) => {
    setYear(year);
  }, []);

  const groupedDataset = useMemo(
    () => dataset && group(dataset, (dataset) => dataset.Year),
    [dataset]
  );

  const selectedGroup = useMemo(
    () => groupedDataset && groupedDataset.get(year),
    [groupedDataset, year]
  );

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

  const rowByNumericCode = useMemo(() => {
    const map =
      selectedGroup &&
      numericCodeByAlphaCode &&
      new Map(
        selectedGroup.map((dataset) => {
          const alphaCode = dataset.Code;
          const numericCode = numericCodeByAlphaCode.get(alphaCode);
          return [numericCode, dataset];
        })
      );
    map?.delete(undefined);
    return map;
  }, [selectedGroup, numericCodeByAlphaCode]);

  const datasetInterval = useMemo(() => {
    const map = new Map<number, Set<string>>();
    for (let i = 0; i < recordedInterval.length; i++) {
      const start = recordedInterval[i];
      const end =
        i === recordedInterval.length - 1 ? Infinity : recordedInterval[i + 1];
      const countryAlphaCodes = new Set<string>();
      selectedGroup?.forEach((dataset) => {
        const aids =
          dataset[
            "Prevalence - HIV/AIDS - Sex: Both - Age: 15-49 years (Percent)"
          ];
        if (aids >= start && aids <= end) countryAlphaCodes.add(dataset.Code);
      });
      map.set(recordedInterval[i], countryAlphaCodes);
    }
    return map;
  }, [recordedInterval, selectedGroup]);

  const allDatasetNumericCountryCode = useMemo(() => {
    const set = new Set<string>();
    selectedGroup?.forEach(({ Code }) => {
      const numericCode = numericCodeByAlphaCode?.get(Code);
      numericCode && set.add(numericCode);
    });
    return set;
  }, [selectedGroup, numericCodeByAlphaCode]);

  return (
    <DatasetContext.Provider
      value={{
        rowByNumericCode,
        numericCodeByAlphaCode,
        alphaCodeByNumericCode,
        isError,
        isLoading,
        handleYear,
        datasetInterval,
        allDatasetNumericCountryCode,
      }}
    >
      {children}
    </DatasetContext.Provider>
  );
}

export function useDatasetContext() {
  return useContext<DatasetContextProps>(DatasetContext);
}
