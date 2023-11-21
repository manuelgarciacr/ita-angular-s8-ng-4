import { NgFor, AsyncPipe } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, FormBuilder } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Observable, startWith, map } from 'rxjs';
import { IEvent } from 'src/domain/model/IEvent';

type Type = IEvent;

export interface DialogData {
    action: string;
    name: string;
    title: string;
    date: Date;
    text: string;
    items: Type[];
}

@Component({
    selector: "calendar-dialog",
    templateUrl: "calendar.dialog.html",
    standalone: true,
    imports: [
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatAutocompleteModule,
        FormsModule,
        NgFor,
        AsyncPipe,
        MatButtonModule,
        ReactiveFormsModule,
    ],
})
export class CalendarDialog {
    private dialogRef = inject(MatDialogRef<CalendarDialog>);
    @Inject(MAT_DIALOG_DATA) private data = inject(DialogData);
    private formBuilder: FormBuilder,
    control = new FormControl<string | Type>("");
    options: Type[] = [];
    filteredOptions!: Observable<Type[]>;

    constructor(

    ) {
        this.options = data.items;
    }

    ngOnInit() {
        this.filteredOptions = this.control.valueChanges.pipe(
            startWith(""),
            map(value => {
                const name = this.name(value!);
                return name
                    ? this._filter(name as string)
                    : this.options.slice();
            })
        );
    }

    onNoClick = (): void => this.dialogRef.close();

    protected displayFn = (item: Type): string => item && item.name ? item.name : "";

    private _filter(name: string): Type[] {
        const filterValue = name.toLowerCase();

        return this.options.filter(option =>
            option.name.toLowerCase().includes(filterValue)
        );
    }

    protected name = (value: string | Type) =>
        typeof value === "string" ? value : value?.name;

}
