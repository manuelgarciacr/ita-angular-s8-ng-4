import { Injectable, inject } from "@angular/core";
import { IDataAdapter, Params } from "../adapters/IDataAdapter";
import { environment } from "src/environments/environment";
import { HttpAdapter } from "../adapters/HttpAdapter";
import { IEvent } from "src/domain/model/IEvent";
import { map } from "rxjs/operators";

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

    getEvents = (arg?: string | Params) =>
        this.dataSource.get(URL, arg).pipe(
            map(resp => {
                resp.data = resp.data.map(v => {
                    v.date = new Date(v.date);
                    return v;
                }); // JSON Date to Date
                return resp;
            })
        );
    putEvent = (Event: IEvent) => this.dataSource.put(URL, Event);
    addEvent = (Event: IEvent) =>
        this.dataSource.post(URL, Event).pipe(
            map(resp => {
                resp.data[0].date = new Date(resp.data[0].date); // JSON Date to Date
                return resp;
            })
        );
    deleteEvent = (id: string) => this.dataSource.delete(URL, id);
}
