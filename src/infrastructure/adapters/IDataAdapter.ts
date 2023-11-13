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

    get: (arg?: string | Params) => Observable<resp<T>>; // Get all
    put: (data: T) => Observable<resp<T>>;
    post: (data: T) => Observable<resp<T>>;
    delete: (id: string) => Observable<resp<T>>;
}

