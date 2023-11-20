import { AfterViewInit, Component, Inject, OnInit } from "@angular/core";
import { CommonModule, NgFor, AsyncPipe } from "@angular/common";
import { FeatureComponent, NgxMapboxGLModule } from "ngx-mapbox-gl";
import { environment } from "src/environments/environment";
import mapboxgl, { LngLat, Map as MbMap } from "mapbox-gl";
//import { FeatureCollection as IFeatCol, Geometry, GeoJsonProperties } from "geojson";
//import MapboxDraw from "@mapbox/mapbox-gl-draw";
// import { start } from "@popperjs/core";
// import MapboxDraw from "@mapbox/mapbox-gl-draw";
// import * as turf from '@turf/turf';
import {
    DrawControlLine,
    DrawControlPoint,
    DrawControlPolygon,
    DrawControlTrash,
    MB,
    feat,
} from "src/utils/Mapbox";
import MapboxDraw, { MapboxDrawOptions } from "@mapbox/mapbox-gl-draw";
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogModule,
    MatDialogRef,
} from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { FeaturesRepoService } from "src/infrastructure/repositories/features-repo.service";
import { IFeatCol } from "src/domain/model/IFeatCol";
import { MatSelectModule } from "@angular/material/select";
import { Observable, startWith, map, async, first } from "rxjs";
import { Dialog2Component } from "src/infrastructure/components/dialog2/dialog2.component";

const SAVE_ICON =
    '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M840-680v480q0 33-23.5 56.5T760-120H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h480l160 160Zm-80 34L646-760H200v560h560v-446ZM480-240q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35ZM240-560h360v-160H240v160Zm-40-86v446-560 114Z"/></svg>';
const REFRESH_ICON =
    '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z"/></svg>';

export interface DialogData {
    action: string;
    name: string;
    features: IFeatCol[];
}

let lngLat: LngLat = new LngLat(2.154007, 41.390205);
let mbMap: MbMap;
const draw = MB.createDraw(
    undefined,
    new DrawControlLine(),
    new DrawControlPolygon(),
    new DrawControlPoint(),
    new DrawControlTrash()
);
// let draw = new MapboxDraw({
//     displayControlsDefault: false,
//     // Select which mapbox-gl-draw control buttons to add to the map.
//     controls: {
//         line_string: true,
//         polygon: true,
//         trash: true,
//     },
//     // Set mapbox-gl-draw to draw by default.
//     // The user does not have to click the polygon control button first.
//     //defaultMode: "draw_line",
// });

@Component({
    standalone: true,
    imports: [
        CommonModule,
        NgxMapboxGLModule,
        MatDialogModule,
        Dialog2Component,
    ],
    templateUrl: "map.component.html",
    styleUrls: ["map.component.scss"],
    providers: [{ provide: MAT_DIALOG_DATA, useValue: {} }],
})
export class MapComponent implements OnInit, AfterViewInit {
    private features: IFeatCol[] = [];
    private name: string = "";

    constructor(private repo: FeaturesRepoService, public dialog: MatDialog) {}

    ngOnInit(): void {
        mapboxgl.accessToken = environment.mapbox;
        mbMap = new mapboxgl.Map({
            container: "map",
            style: "mapbox://styles/mapbox/streets-v12",
            center: lngLat,
            zoom: 14,
        });
        navigator.geolocation.watchPosition(res => {
            lngLat = new LngLat(res.coords.longitude, res.coords.latitude);
            mbMap.setCenter(lngLat);
        });

        /* map.on('draw.create', this.updateArea);
        map.on('draw.delete', this.updateArea);
        map.on('draw.update', this.updateArea); */
console.log("ONINIT")
        this.repo.getFeature().subscribe(resp => (this.features = resp.data));
    }

    ngAfterViewInit(): void {
        // const draw2 = new MapboxDraw({
        //     controls: { line_string: true, polygon: true, point: true },
        // });
        console.log("DRAW", draw);
        mbMap.addControl(draw, "top-right");

        const subGrp = MB.addSubgroup();
        MB.addBtn(subGrp, SAVE_ICON, "Save", () => {
            const data = draw.getAll();
            draw.changeMode("simple_select");
            if (data.features.length == 0) return;
            this.openDialog("Save", this.features, () => {
                console.log("NAME", this.name, "*", data.features, "*");
                if ((this.name ?? "") == "") return;
                const overwrite = this.features.some(v => {
                    console.log("WW", v.name, this.name);
                    return v.name == this.name;
                });
                const dlgRef = this.dialog.open(Dialog2Component, {
                    data: {
                        title: overwrite ? "Overwrite" : "Add",
                        text: overwrite
                            ? `Overwrite the features collection "${this.name}" ?`
                            : `Add the features collection "${this.name}" ?`,
                        yes: "OK",
                        cancel: "CANCEL",
                    },
                });

                dlgRef
                    .afterClosed()
                    .pipe(first())
                    .subscribe(data => {
                        if (data != "yes") return;

                        if (overwrite)
                            this.repo
                                .putFeature({ name: this.name, feature: data })
                                .pipe(first())
                                .subscribe(resp => {
                                    console.log("RRRR", resp);
                                });
                        else
                            this.repo
                                .addFeature({ name: this.name, feature: data })
                                .pipe(first())
                                .subscribe(resp => {
                                    console.log("RRRR", resp);
                                });
                    });
            });
        });
        MB.addBtn(subGrp, REFRESH_ICON, "Load", () => {
            draw.changeMode("simple_select");
            this.openDialog("Load", this.features, () => {
                console.log("NAME", this.name, "*");
                if ((this.name ?? "") == "") return;
                // const overwrite = this.features.some(v => {
                //     console.log("WW", v.name, this.name);
                //     return v.name == this.name;
                // });
                const dlgRef = this.dialog.open(Dialog2Component, {
                    data: {
                        title: "Load",
                        text: `Load the features collection "${this.name}" ?`,
                        yes: "OK",
                        cancel: "CANCEL",
                    },
                });

                dlgRef
                    .afterClosed()
                    .pipe(first())
                    .subscribe(data => {
                        if (data != "yes") return;

                        this.repo
                            .getFeature({ name: this.name })
                            .pipe(first())
                            .subscribe(resp => {
                                draw.deleteAll();
                                console.log("RRRR", resp.data[0]);
                                draw.add(resp.data[0].feature)
                                const bounds = this.fit(resp.data[0]);
                                mbMap.fitBounds(bounds)
                            });

                    });
            });
        });
        //let a: FeatureCollection = feat
        console.log(feat, feat.bbox);
    }

    private fit = (featCol: IFeatCol) => {
        // Geographic coordinates of the LineString
        const features = featCol.feature.features;
        const coordinates: LngLat[] = [];

        features.forEach(v => {
            const geometry = v.geometry as unknown as {
                coordinates: LngLat[] | LngLat[][];
                type: string;
            };
            if (geometry.type == "LineString") {
                coordinates.push(...(geometry.coordinates as LngLat[]));
            } else {
                geometry.coordinates.forEach(coor =>
                    coordinates.push(...(coor as LngLat[]))
                );
            }

            console.log(coordinates.length);
        });
        console.log("BB", coordinates[0]);

        // Create a 'LngLatBounds' with both corners at the first coordinate.
        const bounds = new mapboxgl.LngLatBounds(
            coordinates[0],
            coordinates[0]
        );

        // // Extend the 'LngLatBounds' to include every coordinate in the bounds result.
        for (const coord of coordinates) {
            bounds.extend(coord);
        }
        console.log("BB", coordinates, bounds);

        //map.repaint = true
        //map.triggerRepaint()
        return bounds;
    };

    private save = () => console.log();
    /* updateArea = (e: { features: any; type: string; }) => {
        console.log("DCR", e.features);

        //const data = draw.getAll();
        //const answer = document.getElementById('calculated-area');
        if (data.features.length > 0) {
            //const area = turf.area(data);
            // Restrict the area to 2 decimal points.
            //const rounded_area = Math.round(area * 100) / 100;
            // answer?.innerHTML = `<p><strong>${rounded_area}</strong></p><p>square meters</p>`;
        } else {
            // answer.innerHTML = '';
            if (e.type !== 'draw.delete')
                alert('Click the map to draw a polygon.');
        }
    } */

    openDialog(
        action: string,
        features: IFeatCol[],
        callback: () => void
    ): void {
        const dialogRef = this.dialog.open(MapDialog, {
            data: { name: this.name, features: features, action: action },
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log("The dialog was closed");
            this.name = result;
            callback();
        });
    }
}

@Component({
    selector: "map-dialog",
    templateUrl: "map.dialog.html",
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
        this.options = data.features;
        console.log("COUNT", this.options.length)
    }

    ngOnInit() {
        this.filteredOptions = this.featureCtrl.valueChanges.pipe(
            startWith(""),
            map(value => {
                // console.log("ISSTRING", typeof value === "string", );
                const name = this.name(value!);
                // console.log(
                //     "NAME",
                //     name,
                //     this._filter(name as string),
                //     this.options.slice()
                // );
                return name
                    ? this._filter(name as string)
                    : this.options.slice();
            })
        );
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    displayFn(feature: IFeatCol): string {
        // console.log("DSP", feature, "*", feature && feature.name ? feature.name : '', "*")
        return feature && feature.name ? feature.name : "";
    }

    private _filter(name: string): IFeatCol[] {
        const filterValue = name.toLowerCase();

        return this.options.filter(option =>
            option.name.toLowerCase().includes(filterValue)
        );
    }

    protected name = (value: string | IFeatCol) =>
        typeof value === "string" ? value : value?.name;
}
