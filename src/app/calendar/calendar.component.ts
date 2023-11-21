import { Component, inject } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg,  EventApi } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import { CalendarDialog, DialogData } from "./calendar.dialog/calendar.dialog";
import { IEvent } from 'src/domain/model/IEvent';
import { CalendarRepoService } from 'src/infrastructure/repositories/events-repo.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import interactionPlugin from "@fullcalendar/interaction";
import { AsyncPipe } from "@angular/common";
import { FormGroup } from '@angular/forms';

@Component({
    standalone: true,
    imports: [FullCalendarModule, MatDialogModule, AsyncPipe],
    templateUrl: "./calendar.component.html",
    styles: [],
    providers: [{ provide: MAT_DIALOG_DATA, useValue: {} }],
})
export class CalendarComponent {
    private repo = inject(CalendarRepoService);
    private dialog = inject(MatDialog);

    private data: {
        position: number;
        user: IUser;
        action: string;
    } = inject(MAT_DIALOG_DATA);


    protected form: FormGroup = this.formBuilder.group({});
    protected calendarOptions: CalendarOptions = {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: "dayGridMonth",
        weekends: true,
        selectable: true,
        eventClick(arg) {
            console.log("LOG", arg);
            //alert("date click! " + arg.dateStr);
        },
        eventAdd(arg) {},
        select(arg) {
            console.log("LOG2", arg);
        },
        events: [{ title: "Meeting", start: new Date() }],
    };
    protected item: string | IEvent = "";
    eventsPromise: any;

    constructor() {}

    private openDialog = (
        action: string,
        title: string,
        date: Date,
        text: string,
        items: IEvent[],
        callback: () => void
    ) => {
        const dialogRef = this.dialog.open(CalendarDialog, {
            data: { action, title, date, text, items },
        });

        dialogRef.afterClosed().subscribe(result => {
            this.item = result;
            callback();
        });
    };
}
