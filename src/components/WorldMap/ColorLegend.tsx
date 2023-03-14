import {
  ForwardedRef,
  RefObject,
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { ScaleSequential } from "d3";
import { useColorLegendContext } from "../providers/ColorLegendProvider";
import { Interval } from "../../types/Interval";
import { useWorldMapContext } from "../providers/WorldMapProider";
import { useDatasetContext } from "../providers/DatasetProvider";

export default function ColorLegend() {
  const {
    scaleColor,
    recordedInterval,
    nodataInterval,
    filteredInterval,
    nodataColor,
    setFilteredInterval,
    colorBarsRefs,
    nodataRef,
    widthPercent,
    colorLegendHeight,
    spacing,
    colorLegendOffsetHeight,
    colorLegendOffsetText,
    strokeWidth: strokeWidthColorLegend,
    strokeBold: strokeBoldColorLegend,
  } = useColorLegendContext();
  const {
    innerWidth,
    innerHeight,
    margin: { left },
    countryRefs,
    blurOpacity,
    strokeBold: strokeBoldCountries,
    strokeWidth: strokeWidthCountries,
  } = useWorldMapContext();
  const {
    alphaCodeByNumericCode,
    datasetInterval,
    allDatasetNumericCountryCode,
  } = useDatasetContext();

  const colorLegendWidth = innerWidth * widthPercent - spacing;
  const bandwidth = colorLegendWidth / (recordedInterval.length + 1);
  const offsetWidth = (1 - widthPercent) / 2;
  const boldStrokeWidthColorLegend =
    strokeWidthColorLegend * strokeBoldColorLegend;
  const boldStrokeWidthCountries = strokeWidthCountries * strokeBoldCountries;

  const handleMouse = useCallback(
    (newInterval: Interval) =>
      setFilteredInterval((prev) => ({ prev: prev.cur, cur: newInterval })),
    []
  );

  const nodataRefs = useMemo(() => [nodataRef], [nodataRef]);

  useEffect(() => {
    const { cur, prev } = filteredInterval;
    if (prev === "No data") {
      nodataRef.current?.setAttribute(
        "stroke-width",
        strokeWidthColorLegend.toString()
      );
    } else if (typeof prev === "number") {
      colorBarsRefs[recordedInterval.indexOf(prev)].current?.setAttribute(
        "stroke-width",
        strokeWidthColorLegend.toString()
      );
    }
    if (cur === "No data") {
      nodataRef.current?.setAttribute(
        "stroke-width",
        boldStrokeWidthColorLegend.toString()
      );
    } else if (typeof cur === "number") {
      colorBarsRefs[recordedInterval.indexOf(cur)].current?.setAttribute(
        "stroke-width",
        boldStrokeWidthColorLegend.toString()
      );
    }
  }, [
    filteredInterval,
    colorBarsRefs,
    recordedInterval,
    nodataRef,
    strokeWidthColorLegend,
    boldStrokeWidthColorLegend,
  ]);

  useEffect(() => {
    const { cur } = filteredInterval;
    if (!alphaCodeByNumericCode) return;
    countryRefs.forEach((country) => {
      const { ref } = country;
      ref.current?.setAttribute(
        "stroke-width",
        strokeWidthCountries.toString()
      );
      ref.current?.setAttribute("opacity", "1");
    });
    if (typeof cur === "number") {
      const filteredCountries = datasetInterval.get(cur);
      countryRefs.forEach((country) => {
        const {
          ref,
          feature: { id },
        } = country;
        if (!id) return;
        const alphaCode = alphaCodeByNumericCode.get(id.toString());
        if (!alphaCode) return;
        if (filteredCountries?.has(alphaCode))
          ref.current?.setAttribute(
            "stroke-width",
            boldStrokeWidthCountries.toString()
          );
        else ref.current?.setAttribute("opacity", blurOpacity.toString());
      });
    } else if (cur === "No data") {
      countryRefs.forEach((country) => {
        const {
          ref,
          feature: { id },
        } = country;
        if (!id || !allDatasetNumericCountryCode.has(id.toString()))
          ref.current?.setAttribute(
            "stroke-width",
            boldStrokeWidthCountries.toString()
          );
        else ref.current?.setAttribute("opacity", blurOpacity.toString());
      });
    }
  }, [
    filteredInterval,
    datasetInterval,
    countryRefs,
    alphaCodeByNumericCode,
    strokeWidthCountries,
    boldStrokeWidthCountries,
    blurOpacity,
  ]);

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
        strokeWidth={strokeWidthColorLegend}
        recordedInterval={nodataInterval}
        handleMouse={handleMouse}
        mouseLeaveProps={null}
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
        strokeWidth={strokeWidthColorLegend}
        offsetTextX={0}
        offsetTextY={colorLegendOffsetText}
        handleMouse={handleMouse}
        mouseLeaveProps={null}
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
  handleMouse?: (interval: Interval) => void;
  mouseLeaveProps?: any;
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
            mouseEnterProps={record}
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
