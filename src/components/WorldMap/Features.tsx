import { memo } from "react";
import { Feature, Geometry } from "geojson";
import { useWorldMapContext } from "../providers/WorldMapProider";
import { useDatasetContext } from "../providers/DatasetProvider";
import { useColorLegendContext } from "../providers/ColorLegendProvider";
import Dataset from "../../interfaces/Dataset";
import { GeoPath, GeoPermissibleObjects, ScaleSequential } from "d3";

interface MemoizedFeaturesProps {
  features: Feature<Geometry, {}>[];
  rowByNumericCode: Map<string | undefined, Dataset>;
  scaleColor: ScaleSequential<string, never>;
  nodataColor: string;
  path: GeoPath<any, GeoPermissibleObjects>;
  strokeWidth: number;
}

export default function Features() {
  const { featured, path } = useWorldMapContext();
  const { rowByNumericCode } = useDatasetContext();
  const { scaleColor, nodataColor, strokeWidth } = useColorLegendContext();

  if (!path || !rowByNumericCode) return <></>;

  return (
    <>
      <MemoizedFeatures
        features={featured.features}
        path={path}
        rowByNumericCode={rowByNumericCode}
        scaleColor={scaleColor}
        nodataColor={nodataColor}
        strokeWidth={strokeWidth}
      />
    </>
  );
}

const MemoizedFeatures = memo(function (props: MemoizedFeaturesProps) {
  const {
    features,
    rowByNumericCode,
    scaleColor,
    nodataColor,
    path,
    strokeWidth,
  } = props;

  return (
    <>
      {features.map((feature, index) => {
        const { id } = feature;
        const data = rowByNumericCode.get(id as string);
        const percent =
          data &&
          data[
            "Prevalence - HIV/AIDS - Sex: Both - Age: 15-49 years (Percent)"
          ];
        const color = percent ? scaleColor(percent) : nodataColor;
        return (
          <path
            key={index}
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
