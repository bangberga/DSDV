import { RefObject, memo, useCallback, useEffect } from "react";
import { GeoPath, GeoPermissibleObjects } from "d3";
import styled from "styled-components";
import { useDatasetContext } from "../providers/DatasetProvider";
import { useColorLegendContext } from "../providers/ColorLegendProvider";
import { useYearContext } from "../providers/YearProvider";
import { useWorldMapContext } from "../providers/WorldMapProider";
import { useTooltipContext } from "../providers/TooltipProvider";
import { Country } from "../../types/Country";
import { useLineChartContext } from "../providers/LineChartProvider";

export default function Features() {
  const { path, countryRefs, closeWorldMap } = useWorldMapContext();
  const {
    rowByNumericCodes,
    scaleColor,
    alphaCodeByNumericCode,
    colorBarsRefs,
    nodataRef,
    getIntervalByAids,
    groupedDatasetByCode,
  } = useDatasetContext();
  const { nodataColor } = useColorLegendContext();
  const { year } = useYearContext();
  const { setData, setPosition } = useTooltipContext();
  const { addCountry, clearCountries, openLineChart } = useLineChartContext();

  useEffect(() => {
    if (!rowByNumericCodes) return;
    const rowByNumericCode = rowByNumericCodes.get(year);
    if (!rowByNumericCode) return;
    countryRefs.forEach(({ feature, ref }) => {
      const data = rowByNumericCode.get(feature.id as string);
      const percent = data
        ? data["Prevalence - HIV/AIDS - Sex: Both - Age: 15-49 years (Percent)"]
        : "No data";
      const color = percent !== "No data" ? scaleColor(percent) : nodataColor;
      ref.current?.setAttribute("fill", color);
      ref.current?.setAttribute("data-aids", percent.toString());
    });
  }, [rowByNumericCodes, countryRefs, year, nodataColor]);

  useEffect(() => {
    if (!alphaCodeByNumericCode) return;
    const handleMouseOver = (e: MouseEvent) => {
      const dom = e.target as SVGPathElement;
      const id = dom.dataset.id;
      const name = dom.dataset.name;
      const aids = dom.dataset.aids;
      if (aids === "No data") {
        nodataRef.current?.classList.add("filtered");
      } else {
        const i = getIntervalByAids(+aids!)[0];
        colorBarsRefs[i]?.current?.classList.add("filtered");
      }
      setData({ alphaCode: alphaCodeByNumericCode.get(id!), name });
      setPosition((prev) => ({ ...prev, top: e.clientY, left: e.clientX }));
    };
    const handleMouseLeave = (e: MouseEvent) => {
      nodataRef.current?.classList.remove("filtered");
      colorBarsRefs.forEach((ref) => ref.current?.classList.remove("filtered"));
      setData(null);
    };
    const handleClick = (e: MouseEvent) => {
      const dom = e.target as SVGPathElement;
      const id = dom.dataset.id;
      const alphaCode = alphaCodeByNumericCode.get(id!);
      if (!alphaCode || !groupedDatasetByCode?.has(alphaCode)) return;
      clearCountries();
      addCountry(alphaCode);
      closeWorldMap();
      openLineChart();
    };
    countryRefs.forEach(({ ref }) => {
      ref.current?.addEventListener("mouseover", handleMouseOver);
      ref.current?.addEventListener("mouseleave", handleMouseLeave);
      ref.current?.addEventListener("click", handleClick);
    });
    return () => {
      countryRefs.forEach(({ ref }) => {
        ref.current?.removeEventListener("mouseover", handleMouseOver);
        ref.current?.removeEventListener("mouseleave", handleMouseLeave);
        ref.current?.removeEventListener("click", handleClick);
      });
    };
  }, [
    alphaCodeByNumericCode,
    countryRefs,
    colorBarsRefs,
    nodataRef,
    addCountry,
    groupedDatasetByCode,
  ]);

  return <MemoizedFeatures countryRefs={countryRefs} path={path} />;
}

interface MemoizedFeaturesProps {
  countryRefs: {
    feature: Country;
    ref: RefObject<SVGPathElement>;
  }[];
  path: GeoPath<any, GeoPermissibleObjects>;
}

const MemoizedFeatures = memo(function (props: MemoizedFeaturesProps) {
  const { countryRefs, path } = props;

  return (
    <>
      {countryRefs.map((country, index) => {
        const { feature, ref } = country;
        return (
          <PathWrapper
            data-id={feature.id}
            data-name={feature.properties.name}
            key={index}
            ref={ref}
            d={path(feature)!}
          />
        );
      })}
    </>
  );
});

const PathWrapper = styled.path`
  stroke: none;
  &:hover,
  &.filtered {
    stroke: black;
    stroke-width: 1.5;
  }
`;
