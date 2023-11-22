import { Component, OnInit, inject } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarApi, CalendarOptions, DateSelectArg, EventClickArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import { CalendarDialog } from "./calendar.dialog/calendar.dialog";
import { IEvent } from 'src/domain/model/IEvent';
import { CalendarRepoService } from 'src/infrastructure/repositories/events-repo.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import interactionPlugin from "@fullcalendar/interaction";
import { AsyncPipe } from "@angular/common";
import { first } from 'rxjs';

@Component({
    standalone: true,
    imports: [FullCalendarModule, MatDialogModule, AsyncPipe],
    templateUrl: "./calendar.component.html",
    styles: [],
    providers: [{ provide: MAT_DIALOG_DATA, useValue: {} }],
})
export class CalendarComponent implements OnInit {
    private repo = inject(CalendarRepoService);
    private dialog = inject(MatDialog);

    protected calendarOptions: CalendarOptions = {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: "dayGridMonth",
        weekends: true,
        selectable: true,
        select: this.onSelect.bind(this),
        eventClick: this.onEventClick.bind(this),
    };
    protected item: string | IEvent = "";

    ngOnInit(): void {
        this.repo
            .getEvents()
            .pipe(first())
            .subscribe(events => {
                this.calendarOptions.events = events.data.map((ev, idx) => ({
                    id: String(idx + 1),
                    title: ev.title,
                    start: ev.date.toLocaleString("sv-SE").replace(/ .*$/, ""), // YYYY-MM-DD of today
                    text: ev.text,
                    _id: ev._id,
                }));
            });
    }

    private onSelect(selectInfo: DateSelectArg) {
        const calendarApi = selectInfo.view.calendar;

        this.openDialog(
            "Add",
            { title: "", date: selectInfo.start, text: "" }, // YYYY-MM-DD of date
            resp => {
                if (resp == "") return;

                this.dbAddEvent(calendarApi, resp as IEvent);
            }
        );
    }

    private dbAddEvent = (calendarApi: CalendarApi, event: IEvent) => {

        this.repo
            .addEvent(event)
            .pipe(first())
            .subscribe(resp => {
                if (resp.status != 200) {
                    console.log(resp);
                    return;
                }

                this.addEvent(calendarApi, resp.data[0]);
            });
    };

    private addEvent = (calendarApi: CalendarApi, event: IEvent) => {
        const id = calendarApi.getEvents().length + 1;

        calendarApi.unselect(); // clear date selection

        calendarApi.addEvent({
            id: String(id),
            title: event.title,
            start: event.date,
            allDay: true,
            _id: event._id,
            text: event.text,
        });
    };

    private onEventClick(clickInfo: EventClickArg) {
        const calendarApi = clickInfo.view.calendar;
        const id = clickInfo.event._def.publicId;

        this.openDialog(
            "Modify",
            {
                title: clickInfo.event._def.title,
                date: clickInfo.event.start!,
                text: clickInfo.event._def.extendedProps["text"],
            }, // YYYY-MM-DD of date
            resp => {
                if (resp == "") return;

                const modifyResp = resp as IEvent & { delete?: boolean };
                const deleteEvent = modifyResp["delete"];

                delete modifyResp["delete"];
                modifyResp._id = clickInfo.event._def.extendedProps["_id"];

                if (deleteEvent) {
                    this.dbDeleteEvent(calendarApi, id, modifyResp._id!);
                } else {
                    this.dbModifyEvent(calendarApi, id, modifyResp as IEvent);
                }
            }
        );
    }

    private dbDeleteEvent = (calendarApi: CalendarApi, id: string, _id: string) => {

        this.repo
            .deleteEvent(_id)
            .pipe(first())
            .subscribe(resp => {
                if (resp.status != 200) {
                    console.log(resp);
                    return;
                }
                this.deleteEvent(calendarApi, id);
            });
    };

    private deleteEvent = (
        calendarApi: CalendarApi,
        id: string,
    ) => {

        calendarApi.unselect(); // clear date selection
        calendarApi.getEventById(id)?.remove()
    };

    private dbModifyEvent = (
        calendarApi: CalendarApi,
        id: string,
        event: IEvent
    ) => {

        this.repo
            .putEvent(event)
            .pipe(first())
            .subscribe(resp => {
                if (resp.status != 200) {
                    console.log(resp);
                    return;
                }
                this.modifyEvent(calendarApi, id, event);
            });
    };

    private modifyEvent = (
        calendarApi: CalendarApi,
        id: string,
        event: IEvent
    ) => {

        calendarApi.unselect(); // clear date selection
        calendarApi.getEventById(id)?.setProp("title", event.title);
        calendarApi.getEventById(id)?.setExtendedProp("text", event.text)
    };

    private openDialog = (
        action: string,
        item: IEvent,
        callback: (arg0: unknown) => void
    ) => {
        const dialogRef = this.dialog.open(CalendarDialog, {
            data: { action, item },
        });

        dialogRef.afterClosed().subscribe(result => {
            callback(result);
        });
    };
}
