import {
  ForwardedRef,
  RefObject,
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { useColorLegendContext } from "../providers/ColorLegendProvider";
import { ScaleSequential } from "d3";
import { Interval } from "../../types/Interval";
import { useWorldMapContext } from "../providers/WorldMapProider";

export default function ColorLegend() {
  const {
    scaleColor,
    recordedInterval,
    recordedIntervalIndex,
    nodataInterval,
    nodataIntervalIndex,
    filteredInterval,
    nodataColor,
    setFilteredInterval,
    colorBarsRefs,
    nodataRef,
    strokeWidth,
    widthPercent,
    colorLegendHeight,
    spacing,
    colorLegendOffsetHeight,
    colorLegendOffsetText,
    strokeBold,
  } = useColorLegendContext();
  const {
    innerWidth,
    innerHeight,
    margin: { left },
  } = useWorldMapContext();

  const colorLegendWidth = innerWidth * widthPercent - spacing;
  const bandwidth = colorLegendWidth / (recordedInterval.length + 1);
  const offsetWidth = (1 - widthPercent) / 2;
  const boldStrokeWidth = strokeWidth * strokeBold;

  const handleMouse = useCallback(
    (newInterval: Interval) =>
      setFilteredInterval((prev) => ({ prev: prev.cur, cur: newInterval })),
    []
  );

  const nodataRefs = useMemo(() => [nodataRef], [nodataRef]);

  useEffect(() => {
    const { cur, prev } = filteredInterval;
    if (prev === "NODATA") {
      nodataRef.current?.setAttribute("stroke-width", strokeWidth.toString());
    } else if (typeof prev === "number") {
      colorBarsRefs[prev].current?.setAttribute(
        "stroke-width",
        strokeWidth.toString()
      );
    }
    if (cur === "NODATA") {
      nodataRef.current?.setAttribute(
        "stroke-width",
        boldStrokeWidth.toString()
      );
    } else if (typeof cur === "number") {
      colorBarsRefs[cur].current?.setAttribute(
        "stroke-width",
        boldStrokeWidth.toString()
      );
    }
  }, [filteredInterval]);

  return (
    <g
      transform={`translate(${left + innerWidth * offsetWidth},${
        innerHeight + colorLegendOffsetHeight
      })`}
    >
      <ColorsContainer
        width={bandwidth}
        height={colorLegendHeight}
        translateX={0}
        refs={nodataRefs}
        defaultColor={nodataColor}
        offsetTextX={bandwidth / 2}
        offsetTextY={colorLegendOffsetText}
        strokeWidth={strokeWidth}
        recordedInterval={nodataInterval}
        handleMouse={handleMouse}
        mouseLeaveProps={null}
        mouseEnterProps={nodataIntervalIndex}
        nib={false}
      />
      <ColorsContainer
        recordedInterval={recordedInterval}
        width={bandwidth * recordedInterval.length}
        height={colorLegendHeight}
        translateX={bandwidth + spacing}
        refs={colorBarsRefs}
        scaleColor={scaleColor}
        defaultColor={nodataColor}
        strokeWidth={strokeWidth}
        offsetTextX={0}
        offsetTextY={colorLegendOffsetText}
        handleMouse={handleMouse}
        mouseLeaveProps={null}
        mouseEnterProps={recordedIntervalIndex}
        nib={true}
        recordUnit="%"
      />
    </g>
  );
}

interface ColorsContainerProps {
  width: number;
  height: number;
  translateX: number;
  recordedInterval: number[] | string[];
  refs: RefObject<SVGPolygonElement>[];
  strokeWidth: number;
  offsetTextX: number;
  offsetTextY: number;
  defaultColor: string;
  scaleColor?: ScaleSequential<string, never>;
  handleMouse?: (interval: number) => void;
  mouseLeaveProps?: any;
  mouseEnterProps?: any[];
  nib?: boolean;
  recordUnit?: string;
}

const ColorsContainer = memo(function (props: ColorsContainerProps) {
  const {
    width,
    height,
    translateX,
    recordedInterval,
    scaleColor,
    defaultColor,
    handleMouse,
    mouseLeaveProps,
    mouseEnterProps,
    refs,
    strokeWidth,
    offsetTextX,
    offsetTextY,
    nib: isNib,
    recordUnit,
  } = props;
  const bandwidth = width / recordedInterval.length;

  return (
    <g
      transform={`translate(${translateX},0)`}
      onMouseLeave={
        handleMouse &&
        function () {
          handleMouse(mouseLeaveProps);
        }
      }
    >
      {recordedInterval.map((record, i) => {
        const nib =
          Boolean(isNib) && recordedInterval.length - 1 === i
            ? `${bandwidth + 5},${height / 2}`
            : "";
        return (
          <ColorBar
            key={record}
            ref={refs[i]}
            translateX={bandwidth * i}
            width={bandwidth}
            height={height}
            offsetTextX={offsetTextX}
            offsetTextY={offsetTextY}
            record={`${record}${recordUnit || ""}`}
            nib={nib}
            background={scaleColor ? scaleColor(+record) : defaultColor}
            handleMouse={handleMouse}
            mouseEnterProps={mouseEnterProps?.[i]}
            strokeWidth={strokeWidth}
          />
        );
      })}
    </g>
  );
});

interface ColorBarProps {
  offsetTextX: number;
  offsetTextY: number;
  record: number | string;
  nib: string;
  width: number;
  height: number;
  translateX: number;
  strokeWidth: number;
  background: string;
  handleMouse?: (...props: any) => void;
  mouseEnterProps?: any;
}

const ColorBar = forwardRef(function (
  props: ColorBarProps,
  ref: ForwardedRef<SVGPolygonElement>
) {
  const {
    offsetTextX,
    offsetTextY,
    record,
    nib,
    width,
    height,
    translateX,
    background,
    handleMouse,
    mouseEnterProps,
    strokeWidth,
  } = props;

  return (
    <g transform={`translate(${translateX},0)`}>
      <text className="interval" y={-offsetTextY} x={offsetTextX}>
        {record}
      </text>
      <line
        strokeWidth={strokeWidth}
        y2={-4}
        x1={offsetTextX}
        x2={offsetTextX}
        className="color-dash"
      />
      <polygon
        points={`0,0 ${width},0 ${nib} ${width},${height} 0,${height}`}
        ref={ref}
        fill={background}
        strokeWidth={strokeWidth}
        className="color-bar"
        onMouseEnter={
          handleMouse &&
          function () {
            handleMouse(mouseEnterProps);
          }
        }
      />
    </g>
  );
});
