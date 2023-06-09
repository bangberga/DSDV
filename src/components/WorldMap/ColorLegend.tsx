import {
  ForwardedRef,
  RefObject,
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ScaleSequential } from "d3";
import { useColorLegendContext } from "../providers/ColorLegendProvider";
import { Interval } from "../../types/Interval";
import { useWorldMapContext } from "../providers/WorldMapProider";
import { useDatasetContext } from "../providers/DatasetProvider";
import { useYearContext } from "../providers/YearProvider";
import { styled } from "styled-components";

export default function ColorLegend() {
  const {
    widthPercent,
    colorLegendHeight,
    spacing,
    colorLegendOffsetHeight,
    colorLegendOffsetText,
    nodataColor,
  } = useColorLegendContext();
  const {
    innerWidth,
    innerHeight,
    margin: { left },
    countryRefs,
  } = useWorldMapContext();
  const {
    alphaCodeByNumericCode,
    datasetIntervals,
    allDatasetNumericCountryCodes,
    colorBarsRefs,
    nodataRef,
    scaleColor,
    recordedInterval,
    nodataInterval,
  } = useDatasetContext();
  const { year } = useYearContext();

  const [filteredInterval, setFilteredInterval] = useState<Interval>(null);

  const colorLegendWidth = innerWidth * widthPercent - spacing;
  const bandwidth = colorLegendWidth / (recordedInterval.length + 1);
  const offsetWidth = (1 - widthPercent) / 2;

  const handleMouse = useCallback(
    (newInterval: Interval) => setFilteredInterval(newInterval),
    []
  );

  const nodataRefs = useMemo(() => [nodataRef], [nodataRef]);

  useEffect(() => {
    if (!alphaCodeByNumericCode || !datasetIntervals) return;
    if (typeof filteredInterval === "number") {
      const filteredCountries = datasetIntervals
        .get(year)
        ?.get(filteredInterval);
      countryRefs.forEach((country) => {
        const {
          ref,
          feature: { id },
        } = country;
        if (!id) return;
        const alphaCode = alphaCodeByNumericCode.get(id.toString());
        if (!alphaCode) return;
        if (filteredCountries?.has(alphaCode)) {
          ref.current?.classList.add("filtered");
        } else ref.current?.classList.add("blured");
      });
    } else if (filteredInterval === "No data") {
      countryRefs.forEach((country) => {
        const {
          ref,
          feature: { id },
        } = country;
        if (!id || !allDatasetNumericCountryCodes?.has(id.toString())) {
          ref.current?.classList.add("filtered");
        } else ref.current?.classList.add("blured");
      });
    }
    return () => {
      countryRefs.forEach((country) => {
        const { ref } = country;
        ref.current?.classList.remove("filtered", "blured");
      });
    };
  }, [
    filteredInterval,
    datasetIntervals,
    year,
    countryRefs,
    alphaCodeByNumericCode,
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
  } = props;

  return (
    <ColorBarWrapper transform={`translate(${translateX},0)`}>
      <text y={-offsetTextY} x={offsetTextX}>
        {record}
      </text>
      <line y2={-4} x1={offsetTextX} x2={offsetTextX} />
      <polygon
        points={`0,0 ${width},0 ${nib} ${width},${height} 0,${height}`}
        ref={ref}
        fill={background}
        onMouseEnter={
          handleMouse &&
          function () {
            handleMouse(mouseEnterProps);
          }
        }
      />
    </ColorBarWrapper>
  );
});

const ColorBarWrapper = styled.g`
  polygon,
  line {
    stroke: black;
    stroke-width: 0.2;
    &.filtered,
    &:hover {
      stroke-width: 1.5;
    }
  }
  text {
    font-size: 0.7rem;
    stroke: black;
    stroke-width: 0.4;
  }
`;
