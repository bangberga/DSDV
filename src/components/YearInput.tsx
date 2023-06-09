import { useCallback, useEffect, useRef, useState } from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import styled from "styled-components";
import { useYearContext } from "./providers/YearProvider";
import { useWorldMapContext } from "./providers/WorldMapProider";

interface YearInputProps {
  width: number;
  rangepercent?: number;
  nib?: number;
  radius?: number;
}

const defaultYearInputProps = {
  rangepercent: 0.7,
  nib: 10,
  radius: 8.5,
};

interface Tooltip {
  width?: number;
  paddingLeft?: number;
  paddingRight?: number;
  left?: number;
  top?: number;
  show: boolean;
}

export default function YearInput(props: YearInputProps) {
  const { width, rangepercent, nib, radius } = props;
  const { show } = useWorldMapContext();
  const { start, end, year, handleYear, nextYear } = useYearContext();
  const [isRun, setIsRun] = useState<boolean>(false);
  const [tooltip, setTooltip] = useState<Tooltip>({ show: false });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const rangewidth =
    width * (rangepercent || defaultYearInputProps.rangepercent);
  const pointerwidth = (radius || defaultYearInputProps.radius) * 2;

  const toggle = useCallback(() => {
    if (year === end && !isRun) nextYear();
    setIsRun((prev) => !prev);
  }, [year, end, isRun, nextYear]);

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

  useEffect(() => {
    const dom = tooltipRef.current;
    if (!dom) return;
    setTooltip((prev) => ({
      ...prev,
      width: dom.offsetWidth,
      paddingLeft: +getComputedStyle(dom).paddingLeft,
      paddingRight: +getComputedStyle(dom).paddingRight,
    }));
  }, [tooltipRef.current]);

  useEffect(() => {
    const dom = wrapperRef.current;
    if (!dom) return;
    const handleMouseOver = () => {
      setTooltip((prev) => ({
        ...prev,
        show: true,
      }));
    };
    const handleMouseOut = () => {
      setTooltip((prev) => ({ ...prev, show: false }));
    };
    dom.addEventListener("mouseover", handleMouseOver);
    dom.addEventListener("mouseout", handleMouseOut);
    return () => {
      dom.removeEventListener("mouseover", handleMouseOver);
      dom.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  useEffect(() => {
    const dom = inputRef.current;
    if (!dom) return;
    const { x, width } = dom.getBoundingClientRect();
    const percent = (year - start) / (end - start);
    const mainContainer = document.querySelector(".main")!;
    const { x: mainX } = mainContainer.getBoundingClientRect();
    const paddingLeftMain = parseFloat(
      window.getComputedStyle(mainContainer).getPropertyValue("padding-left")
    );
    setTooltip((prev) => ({
      ...prev,
      left:
        x +
        percent * width -
        (tooltipRef.current?.getBoundingClientRect().width || 0) / 2 -
        (pointerwidth * percent - pointerwidth / 2) -
        mainX -
        paddingLeftMain,
      top:
        -(tooltipRef.current?.getBoundingClientRect().height || 0) -
        (nib || defaultYearInputProps.nib / 2),
    }));
  }, [
    inputRef.current,
    tooltipRef.current,
    year,
    start,
    end,
    pointerwidth,
    nib,
  ]);

  return (
    <Wrapper
      width={width}
      rangewidth={rangewidth}
      tooltip={tooltip}
      nib={nib || defaultYearInputProps.nib}
      pointerwidth={pointerwidth}
      ref={wrapperRef}
      show={show + ""}
    >
      <button onClick={toggle}>{isRun ? <FaPause /> : <FaPlay />}</button>
      <span onClick={() => handleYear(start)}>{start}</span>
      <input
        type="range"
        min={start}
        max={end}
        value={year}
        onChange={(e) => {
          handleYear(+e.target.value);
        }}
        ref={inputRef}
      />
      <span onClick={() => handleYear(end)}>{end}</span>
      <div className="tool-tip" ref={tooltipRef}>
        <p>{year}</p>
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div<{
  width?: number;
  rangewidth: number;
  tooltip: Tooltip;
  nib: number;
  pointerwidth: number;
  show: string;
}>`
  width: ${({ width }) => `${width}px` || "maxcontent"};
  display: ${({ show }) => (show === "true" ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  column-gap: 10px;
  position: relative;
  margin-top: 1rem;
  input {
    -webkit-appearance: none;
    background-color: lightgray;
    border: none;
    height: 5px;
    width: ${({ rangewidth }) => rangewidth}px;
    cursor: pointer;
    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      cursor: col-resize;
      width: ${({ pointerwidth }) => pointerwidth}px;
      height: ${({ pointerwidth }) => pointerwidth}px;
      border-radius: 50%;
      background-color: white;
      cursor: col-resize;
      border: 2px solid dodgerblue;
      box-shadow: 0 1px 2px 2px rgba(0, 0, 0, 0.1);
    }
  }
  span,
  button {
    font-size: large;
    color: grey;
    cursor: pointer;
    &:hover {
      color: dodgerblue;
    }
  }
  button {
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    background: transparent;
  }
  .tool-tip {
    position: absolute;
    color: #fff;
    background: black;
    padding: 2px 10px;
    border-radius: 0.25rem;
    left: ${({ tooltip: { left } }) => left || 0}px;
    top: ${({ tooltip: { top } }) => top || 0}px;
    z-index: 2;
    opacity: ${({ tooltip: { show } }) => (show ? 1 : 0)};
    ${({ tooltip: { show } }) => (!show ? "transition: all 0.2s linear;" : "")}
    &::after {
      content: "";
      width: ${({ nib }) => nib}px;
      height: ${({ nib }) => nib}px;
      background: inherit;
      position: absolute;
      bottom: -${({ nib }) => nib / 2}px;
      left: ${({ tooltip: { width, paddingLeft, paddingRight }, nib }) =>
        ((width || 0) - (paddingLeft || 0) - (paddingRight || 0)) / 2 -
        nib / 2}px;
      transform: rotate(-45deg);
      transform-origin: center;
      z-index: 1;
    }
  }
`;
