import {
    FeatureCollection
} from "geojson";

export interface IEvent {
    _id?: string;
    name: string;
    title: string;
    date: Date;
    text: string;
    createdAt?: string;
    updatedAt?: string;
    __v?: string;
}
