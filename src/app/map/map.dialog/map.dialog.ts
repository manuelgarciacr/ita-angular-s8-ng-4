import { NgFor, AsyncPipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Observable, startWith, map } from 'rxjs';
import { IFeatCol } from 'src/domain/model/IFeatCol';

export interface DialogData {
    action: string;
    name: string;
    features: IFeatCol[];
}

@Component({
    selector: "map-dialog",
    templateUrl: "map.dialog.html",
    styleUrls: ["./map.dialog.css"],
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
export class MapDialog {
    featureCtrl = new FormControl<string | IFeatCol>("");
    options: IFeatCol[] = [];
    filteredOptions!: Observable<IFeatCol[]>;

    constructor(
        public dialogRef: MatDialogRef<MapDialog>,
        @Inject(MAT_DIALOG_DATA) protected data: DialogData
    ) {
        this.options = data.features.sort((a, b) => a.name == b.name ? 0 : a.name > b.name ? 1 : -1);

    }

    ngOnInit() {
        this.filteredOptions = this.featureCtrl.valueChanges.pipe(
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

    protected displayFn = (feature: IFeatCol): string => feature && feature.name ? feature.name : "";

    private _filter(name: string): IFeatCol[] {
        const filterValue = name.toLowerCase();

        return this.options.filter(option =>
            option.name.toLowerCase().includes(filterValue)
        );
    }

    protected name = (value: string | IFeatCol) =>
        typeof value === "string" ? value : value?.name;

    protected value = (value: string | IFeatCol) =>
        typeof value === "string" ? {_id: "", name: value} : {_id: value._id, name: value.name};
}
