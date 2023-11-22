import { Injectable, inject } from "@angular/core";
import { IDataAdapter, Params } from "../adapters/IDataAdapter";
import { environment } from "src/environments/environment";
import { HttpAdapter } from "../adapters/HttpAdapter";
import { IEvent } from "src/domain/model/IEvent";

const URL = `${environment.url}/events`;

@Injectable({
    providedIn: "root",
})
export class CalendarRepoService {
    private dataSource: IDataAdapter<IEvent> = inject(HttpAdapter);
    private _entries: IEvent[] = [];
    get entries(): IEvent[] {
        return this._entries;
    }

    getEvent = (arg?: string | Params) => this.dataSource.get(URL, arg);
    putEvent = (Event: IEvent) => this.dataSource.put(URL, Event);
    addEvent = (Event: IEvent) => this.dataSource.post(URL, Event);
    deleteEvent = (id: string) => this.dataSource.delete(URL, id);
}
