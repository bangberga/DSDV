import { MultiLineString, FeatureCollection, Feature } from "geojson";

export default interface WorldAtlas {
  featured: FeatureCollection | Feature;
  interiors: MultiLineString;
  outeriors: MultiLineString;
}
