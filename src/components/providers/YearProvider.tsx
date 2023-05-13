import { ReactNode, createContext, useContext } from "react";
import useYear from "../../hooks/useYear";

interface YearProviderProps {
  children: ReactNode | undefined;
  start: number;
  end: number;
}

interface YearContextProps {
  year: number;
  nextYear: () => void;
  handleYear: (year: number) => void;
  start: number;
  end: number;
}

const YearContext = createContext<YearContextProps>({
  year: 0,
  nextYear: () => {},
  handleYear: (year: number) => {},
  start: 0,
  end: 0,
});

export default function YearProvider(props: YearProviderProps) {
  const { children, start, end } = props;
  const { year, nextYear, handleYear } = useYear({ start, end });
  return (
    <YearContext.Provider value={{ start, end, year, nextYear, handleYear }}>
      {children}
    </YearContext.Provider>
  );
}

export function useYearContext() {
  return useContext<YearContextProps>(YearContext);
}
