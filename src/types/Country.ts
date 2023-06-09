import { Geometry, Feature, FeatureCollection } from "geojson";
export type Country = Feature<Geometry, { name: string }>;
export type Countries = FeatureCollection<Geometry, { name: string }>;
