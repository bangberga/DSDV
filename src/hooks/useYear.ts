import { useCallback, useState } from "react";

interface UseYearProps {
  start: number;
  end: number;
}

export default function useYear(props: UseYearProps) {
  const { start, end } = props;
  const [year, setYear] = useState<number>(end);

  const handleYear = useCallback(
    (year: number) => {
      setYear((prev) => {
        return year >= end ? end : year <= start ? start : year;
      });
    },
    [end, start]
  );

  const nextYear = useCallback(() => {
    setYear((prev) => {
      return prev === end ? start : prev + 1;
    });
  }, [start, end]);

  return { year, nextYear, handleYear };
}
