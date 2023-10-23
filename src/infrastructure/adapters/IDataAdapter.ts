import { Observable } from "rxjs";

export type resp<T> = {
    status: number,
    message: string,
    data: T[]
}

export type Params = {
    [param: string]: string | number | boolean | readonly (string | number | boolean)[];
};

export interface IDataAdapter<T> {
    url: string;

    //get: (url: string) => Observable<resp<T>>;
    get: (arg?: string | Params) => Observable<resp<T>>; // Get all
    //get: <T>(url: string) => Promise<{ status: number; data: T }>;
    put: (user: T) => Observable<resp<T>>;
    // put: <T>(url: string, data: T) => Observable<resp<T>>;
    // post: <T>(url: string, data: T) => Observable<resp<T>>;
}

