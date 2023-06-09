import { useState, useCallback, ChangeEvent, useEffect } from "react";
import {
  TbPlayerTrackNextFilled,
  TbPlayerTrackPrevFilled,
} from "react-icons/tb";
import { styled } from "styled-components";
import { useLineChartContext } from "./providers/LineChartProvider";

interface RangeInputProps {
  start: number;
  end: number;
  width: number;
}

export default function RangeInput(props: RangeInputProps) {
  const { start, end, width } = props;
  const { handleRange, show } = useLineChartContext();
  const [first, setFirst] = useState<number>(start);
  const [second, setSecond] = useState<number>(end);

  const handleFirst = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = +e.target.value;
      setFirst(value > second ? second : value);
    },
    [second]
  );

  const handleSecond = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = +e.target.value;
      setSecond(value < first ? first : value);
    },
    [first]
  );

  const handleSlide = useCallback(
    (value: number) => {
      if ((value < 0 && first === start) || (value > 0 && second === end))
        return;
      setFirst((prev) => prev + value);
      setSecond((prev) => prev + value);
    },
    [first, second]
  );

  useEffect(() => {
    handleRange([first, second]);
  }, [first, second, handleRange]);

  return (
    <Wrapper width={width} show={show + ""}>
      <button
        onMouseDownCapture={() => handleSlide(-1)}
        style={{ justifySelf: "end" }}
      >
        <TbPlayerTrackPrevFilled />
      </button>
      <input
        type="number"
        min={start}
        max={end}
        value={first}
        onChange={handleFirst}
      />
      <input
        type="number"
        min={start}
        max={end}
        value={second}
        onChange={handleSecond}
      />
      <button
        onMouseDownCapture={() => handleSlide(1)}
        style={{ justifySelf: "start" }}
      >
        <TbPlayerTrackNextFilled />
      </button>
    </Wrapper>
  );
}

const Wrapper = styled.section<{ width: number; show: string }>`
  display: ${({ show }) => (show === "true" ? "flex" : "none")};
  width: ${({ width }) => width}px;
  justify-content: center;
  align-items: center;
  column-gap: 5px;
  input {
    padding: 0 5px;
    border: 1px solid grey;
    color: grey;
  }
  button {
    border: none;
    background: grey;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    color: white;
    cursor: pointer;
    transition: all 0.2s linear;
    &:hover {
      background: dodgerblue;
    }
  }
`;
