import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import useDataset from "../../hooks/useDataset";
import Dataset from "../../interfaces/Dataset";
import { group } from "d3";
import useCode from "../../hooks/useCode";

interface DatasetProviderProps {
  children: ReactNode | undefined;
  initialYear: number;
}

interface DatasetContextProps {
  rowByNumericCode: Map<string | undefined, Dataset> | undefined;
  isLoading: boolean;
  isError: boolean;
  handleYear: (year: number) => void;
  selectedGroup: Dataset[] | undefined;
}

const DatasetContext = createContext<DatasetContextProps>({
  rowByNumericCode: undefined,
  isLoading: true,
  isError: false,
  handleYear: (year: number) => {},
  selectedGroup: undefined,
});

export default function DatasetProvider(props: DatasetProviderProps) {
  const { children } = props;
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

  const rowByNumericCode = useMemo(
    () =>
      selectedGroup &&
      new Map(
        selectedGroup.map((data) => {
          const alphaCode = data.Code;
          const numericCode = numericCodeByAlphaCode?.get(alphaCode);
          return [numericCode, data];
        })
      ),
    [selectedGroup, numericCodeByAlphaCode]
  );

  return (
    <DatasetContext.Provider
      value={{
        selectedGroup,
        rowByNumericCode,
        isError,
        isLoading,
        handleYear,
      }}
    >
      {children}
    </DatasetContext.Provider>
  );
}

export function useDatasetContext() {
  return useContext<DatasetContextProps>(DatasetContext);
}
