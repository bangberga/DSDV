import { MultiLineString, FeatureCollection, Feature } from "geojson";

export default interface WorldAtlas {
  interiors: MultiLineString;
  featured: FeatureCollection | Feature;
}
