import { useCallback, useEffect, useState } from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import styled from "styled-components";
import { useYearContext } from "./providers/YearProvider";

export default function RangeInput() {
  const { start, end, year, handleYear, nextYear } = useYearContext();
  const [isRun, setIsRun] = useState<boolean>(false);

  const toggle = useCallback(() => {
    if (year === end) nextYear();
    setIsRun((prev) => !prev);
  }, [year, end, nextYear]);

  useEffect(() => {
    let interval: number;
    if (isRun) {
      interval = setInterval(() => {
        if (year === end) return setIsRun(false);
        nextYear();
      }, 200);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isRun, nextYear, year, end]);

  return (
    <Wrapper>
      <button onClick={toggle}>{isRun ? <FaPause /> : <FaPlay />}</button>
      <span>{start}</span>
      <input
        type="range"
        min={start}
        max={end}
        value={year}
        onChange={(e) => {
          handleYear(+e.target.value);
        }}
      />
      <span>{end}</span>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  input[type="range"] {
    cursor: col-resize;
  }
`;
