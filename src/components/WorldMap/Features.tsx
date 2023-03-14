import { RefObject, memo } from "react";
import { GeoPath, GeoPermissibleObjects, ScaleSequential } from "d3";
import { Feature, Geometry } from "geojson";
import { useWorldMapContext } from "../providers/WorldMapProider";
import { useDatasetContext } from "../providers/DatasetProvider";
import { useColorLegendContext } from "../providers/ColorLegendProvider";
import Dataset from "../../interfaces/Dataset";

export default function Features() {
  const { path, countryRefs } = useWorldMapContext();
  const { rowByNumericCode } = useDatasetContext();
  const { scaleColor, nodataColor, strokeWidth } = useColorLegendContext();

  if (!path || !rowByNumericCode) return <></>;

  return (
    <MemoizedFeatures
      countryRefs={countryRefs}
      path={path}
      rowByNumericCode={rowByNumericCode}
      scaleColor={scaleColor}
      nodataColor={nodataColor}
      strokeWidth={strokeWidth}
    />
  );
}

interface MemoizedFeaturesProps {
  countryRefs: {
    feature: Feature<Geometry, {}>;
    ref: RefObject<SVGPathElement>;
  }[];
  rowByNumericCode: Map<string | undefined, Dataset>;
  scaleColor: ScaleSequential<string, never>;
  nodataColor: string;
  path: GeoPath<any, GeoPermissibleObjects>;
  strokeWidth: number;
}

const MemoizedFeatures = memo(function (props: MemoizedFeaturesProps) {
  const {
    countryRefs,
    rowByNumericCode,
    scaleColor,
    nodataColor,
    path,
    strokeWidth,
  } = props;

  return (
    <>
      {countryRefs.map((country, index) => {
        const { feature, ref } = country;
        const data = rowByNumericCode.get(feature.id as string);
        const percent =
          data &&
          data[
            "Prevalence - HIV/AIDS - Sex: Both - Age: 15-49 years (Percent)"
          ];
        const color = percent ? scaleColor(percent) : nodataColor;
        return (
          <path
            key={index}
            ref={ref}
            className="countries"
            d={path(feature)!}
            fill={color}
            strokeWidth={strokeWidth}
            stroke="black"
          />
        );
      })}
    </>
  );
});
