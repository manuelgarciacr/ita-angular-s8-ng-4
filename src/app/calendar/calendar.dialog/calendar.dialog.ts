import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { IEvent } from 'src/domain/model/IEvent';

type Type = IEvent;

export interface DialogData {
    action: string;
    item: Type;
//    items: Type[];
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
        MatCheckboxModule,
        MatAutocompleteModule,
        MatIconModule,
        FormsModule,
        NgIf,
        AsyncPipe,
        MatButtonModule,
        ReactiveFormsModule,
    ],
})
export class CalendarDialog {
    //private dialogRef = inject(MatDialogRef<CalendarDialog>);
    protected data: DialogData = inject(MAT_DIALOG_DATA);
    private formBuilder = inject(FormBuilder);
    //private options: Type[] = this.data.items;
    //private filteredOptions!: Observable<Type[]>;
    protected control = new FormControl<string | Type>("");
    protected fg: FormGroup = this.formBuilder.group({});
    protected formDisabled = false;

    ngOnInit() {
        const formGroup = {
            // _id: new FormControl(""),
            // updatedAt: new FormControl(""),
            // createdAt: new FormControl(""),
            // __v: new FormControl(""),
            title: new FormControl(this.data.item.title, {
                validators: [Validators.required],
            }),
            text: new FormControl(this.data.item.text, {
                validators: [Validators.required],
            }),
            date: new FormControl(
                this.data.item.date.toLocaleString("es-ES").replace(/,.*$/, "")
            ),
            delete:
                this.data.action === "Modify"
                    ? new FormControl(false)
                    : undefined,
        };
        this.fg = this.formBuilder.group(formGroup);
        // this.fg
        //     .get("date")
        //     ?.setValue(
        //         this.data.item.date.toLocaleString("es-ES").replace(/,.*$/, "")
        //     );
        if (this.data.action == "Delete") {
            this.formDisabled = true;
        }
    }

    protected getError = (field: string) => {
        const errors = this.fg.get(field)?.errors ?? {};

        if (Object.keys(errors).length === 0) return null;
        const subject = field === "title" ? "The title" : "The text";

        if (errors["required"]) return subject + " is mandatory.";
        // if (errors["minlength"])
        //     return (
        //         subject +
        //         ` must be at lest ${errors["minlength"].requiredLength} characters.`
        //     );

        // if (errors["checkPassword"])
        //     return (
        //         subject +
        //         " must have at least one lowercase letter, one uppercase letter, one digit, and one special character."
        //     );
        return subject + " is not valid.";
    };

    // onNoClick = (): void => this.dialogRef.close();
    protected action = () => ({ ...this.fg.value, date: this.data.item.date });

    // Helpers
    getCtrl = (name: string) => this.fg.get(name) as FormControl;
    isSet = (name: string) => this.fg.get(name)?.value != "";
    set = (name: string, val: unknown) => this.fg.get(name)?.setValue(val);
    get = (name: string) => this.fg.get(name)?.value;
    areChanges = () => {
        const a = this.fg.value;
        const b = this.data.item;
        return Object.keys(a).some(key => a[key] !== b[key as keyof Type]);
    };
}
