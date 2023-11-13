import {
    FeatureCollection
} from "geojson";

export interface IFeatCol {
    _id?: string;
    name: string;
    feature: FeatureCollection;
    createdAt?: string;
    updatedAt?: string;
    __v?: string;
}
