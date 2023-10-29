import { Component, Inject } from "@angular/core";
import { NgIf } from "@angular/common";
import { MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

@Component({
    selector: "dialog2",
    standalone: true,
    imports: [
        NgIf,
        MatDialogModule,
        MatIconModule,
        MatButtonModule,
    ],
    templateUrl: "./dialog2.component.html",
    styleUrls: ["./dialog2.component.scss"],
})
export class Dialog2Component {

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: {title: string, text: string, yes?: string, no?: string, cancel?: string}
    ) {}

}
