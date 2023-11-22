import { Component, OnInit, inject } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventClickArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import { CalendarDialog, DialogData } from "./calendar.dialog/calendar.dialog";
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
export class CalendarComponent implements OnInit{
    private repo = inject(CalendarRepoService);
    private dialog = inject(MatDialog);
    private data: DialogData = inject(MAT_DIALOG_DATA);
    private id = 0;
    private events: IEvent[] = [];
    //protected form: FormGroup = this.formBuilder.group({});

    protected calendarOptions: CalendarOptions = {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: "dayGridMonth",
        weekends: true,
        selectable: true,
        // eventClick(arg) {
        //     console.log("LOG", arg);
        //     //alert("date click! " + arg.dateStr);
        // },
        //eventAdd(arg) {},
        // select(arg) {
        //     CalendarComponent.openDialog("Add", {});
        // },
        select: this.onSelect.bind(this),
        eventClick: this.onEventClick.bind(this),
        // events: [{ title: "Meeting", start: new Date() }],
    };
    protected item: string | IEvent = "";

    ngOnInit(): void {
        this.repo.getEvents().pipe(first()).subscribe(
            events => {
                events.data.forEach(v => {
                    this.events.push(v);
                //const calendarApi = selectInfo.view.calendar;

                // calendarApi.unselect(); // clear date selection

                // calendarApi.addEvent({
                //     id: String(this.events.length),
                //     title: v.title,
                //     start: v.date,
                //     allDay: true,
                // });
                });
                this.calendarOptions.events = this.events.map((ev, idx) => ({
                    id: String(idx + 1),
                    title: ev.title,
                    start: ev.date.toLocaleString("sv-SE").replace(/ .*$/, ""), // YYYY-MM-DD of today
                    text: ev.text,
                    _id: ev._id
                }));
            }
        );

    }

    private onSelect(selectInfo: DateSelectArg) {
        console.log("INFOINFO", selectInfo);
        this.openDialog(
            "Add",
            { title: "", date: selectInfo.start, text: "" }, // YYYY-MM-DD of date
            resp => {
                console.log("RESP01", resp)
                if (resp == "")
                    return;
                this.repo
                    .addEvent(resp as IEvent)
                    .pipe(first())
                    .subscribe(resp => {
                        if (resp.status != 200) {
                            console.log(resp);
                            return;
                        }
                        console.log("RESP02", resp.data[0].date);
                        const calendarApi = selectInfo.view.calendar;

                        calendarApi.unselect(); // clear date selection

                        //if (resp.data[0].title) {
                        //const DATE_STR = resp.data[0].date
                        //.toISOString()
                        //.replace(/T.*$/, ""); // YYYY-MM-DD of date
                        calendarApi.addEvent({
                            id: String(++this.id),
                            title: resp.data[0].title,
                            start: resp.data[0].date,
                            allDay: true,
                            _id: resp.data[0]._id,
                            text: resp.data[0].text
                            // end: selectInfo.endStr,
                            // allDay: selectInfo.allDay,
                        });
                        //}
                    });
            }
        );
    }

    private onEventClick(clickInfo: EventClickArg) {
        const id = clickInfo.event.id;
        const event = this.events;
        console.log("CLKCLKCLK", clickInfo.event._def, event, {
            title: clickInfo.event._def.title,
            date: clickInfo.event.start!,
            text: clickInfo.event._def.extendedProps["text"],
        });
        this.openDialog(
            "Modify",
            {
                title: clickInfo.event._def.title,
                date: clickInfo.event.start!,
                text: clickInfo.event._def.extendedProps['text'],
            }, // YYYY-MM-DD of date
            resp => {
                const modifyResp = resp as IEvent & { delete?: boolean };
                delete modifyResp["delete"];
                modifyResp._id = clickInfo.event._def.extendedProps["_id"];
                console.log("RESP01", modifyResp as IEvent);
                this.repo
                    .putEvent(modifyResp as IEvent)
                    .pipe(first())
                    .subscribe(resp => {
                        if (resp.status != 200) {
                            console.log(resp);
                            return;
                        }
                        console.log("RESP02", resp);
                        const calendarApi = clickInfo.view.calendar;

                        calendarApi.unselect(); // clear date selection
                        calendarApi
                            .getEventById(id)?.setProp("title", modifyResp.title);
                        calendarApi
                            .getEventById(id)?.setExtendedProp("text", modifyResp.text);
                        //         //if (resp.data[0].title) {
                        //         //const DATE_STR = resp.data[0].date
                        //         //.toISOString()
                        //         //.replace(/T.*$/, ""); // YYYY-MM-DD of date
                        //         calendarApi.addEvent({
                        //             id: String(++this.id),
                        //             title: resp.data[0].title,
                        //             start: resp.data[0].date,
                        //             allDay: true,
                        //             // end: selectInfo.endStr,
                        //             // allDay: selectInfo.allDay,
                        //         });
                        //         //}
                    });
            }
        );
    }

    private openDialog = (
        action: string,
        item: IEvent,
        callback: (arg0: unknown) => void
    ) => {
        const dialogRef = this.dialog.open(CalendarDialog, {
            data: { action, item },
        });

        dialogRef.afterClosed().subscribe(result => {
            //this.item = result;
            callback(result);
        });
    };


}
