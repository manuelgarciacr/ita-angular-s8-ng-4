import { AfterViewInit, Component, OnInit } from "@angular/core";
import { NgxMapboxGLModule } from "ngx-mapbox-gl";
import { environment } from "src/environments/environment";
import mapboxgl, { LngLat, Marker, Map as MbMap } from "mapbox-gl";
import {
    DrawControlLine,
    DrawControlPoint,
    DrawControlPolygon,
    DrawControlTrash,
    MB,
} from "src/utils/Mapbox";
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogModule,
} from "@angular/material/dialog";
import { FeaturesRepoService } from "src/infrastructure/repositories/features-repo.service";
import { IFeatCol } from "src/domain/model/IFeatCol";
import { first } from "rxjs";
import { Dialog2Component } from "src/infrastructure/components/dialog2/dialog2.component";
import { MapDialog } from "./map.dialog/map.dialog";

const SAVE_ICON =
    '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M840-680v480q0 33-23.5 56.5T760-120H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h480l160 160Zm-80 34L646-760H200v560h560v-446ZM480-240q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35ZM240-560h360v-160H240v160Zm-40-86v446-560 114Z"/></svg>';
const DOWNLOAD_ICON =
    '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/></svg>';

let lngLat: LngLat = new LngLat(2.154007, 41.390205);
let mbMap: MbMap;
const draw = MB.createDraw(
    undefined,
    new DrawControlLine(),
    new DrawControlPolygon(),
    new DrawControlPoint(),
    new DrawControlTrash()
);

@Component({
    standalone: true,
    imports: [NgxMapboxGLModule, MatDialogModule, Dialog2Component],
    templateUrl: "map.component.html",
    styleUrls: ["map.component.scss"],
    providers: [{ provide: MAT_DIALOG_DATA, useValue: {} }],
})
export class MapComponent implements OnInit, AfterViewInit {
    private features: IFeatCol[] = [];
    private name: string = "";
    private dialogResult: {_id: string, name: string} = {_id: "", name: ""}
    private markers: Marker[] = [];

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

        this.repo.getFeatures().subscribe(resp => (this.features = resp.data));
    }

    ngAfterViewInit(): void {
        mbMap.addControl(draw, "top-right");
        mbMap.addControl(new mapboxgl.NavigationControl(), "top-left");
        mbMap.addControl(
            new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true,
                },
                // When active the map will receive updates to the device's location as it changes.
                trackUserLocation: true,
                // Draw an arrow next to the location dot to indicate which direction the device is heading.
                showUserHeading: true,
            }),
            "top-left"
        );
        mbMap.on("load", () => {
            // Add an image to use as a custom marker
            mbMap.loadImage("assets/attraction.png", (error, image) => {
                if (error) throw error;

                this.addAttractions(image);
            });
            mbMap.loadImage("assets/restaurant.png", (error, image) => {
                if (error) throw error;

                this.addRestaurants();
            });
        });

        const subGrp = MB.addSubgroup();

        MB.addBtn(subGrp, SAVE_ICON, "Save", () => {
            const data = draw.getAll();

            draw.changeMode("simple_select");

            if (data.features.length == 0) return;

            this.openDialog("Save", this.features, () => {
                if ((this.name ?? "") == "") return;

                const id = this.features.find(v => v.name == this.name)?._id;

                const dlgRef = this.dialog.open(Dialog2Component, {
                    data: {
                        title: id ? "Overwrite" : "Add",
                        text: id
                            ? `Overwrite the features collection "${this.name}" ?`
                            : `Add the features collection "${this.name}" ?`,
                        yes: "OK",
                        cancel: "CANCEL",
                    },
                });

                dlgRef
                    .afterClosed()
                    .pipe(first())
                    .subscribe(resp => {
                        if (resp != "yes") return;

                        if (id)
                            this.repo
                                .putFeature({
                                    _id: id,
                                    name: this.name,
                                    feature: data,
                                })
                                .pipe(first())
                                .subscribe(resp => {
                                    const idx = this.features.findIndex(
                                        v => v._id == id
                                    );
                                    if (idx >= 0)
                                        this.features[idx] = resp.data[0];
                                });
                        else
                            this.repo
                                .addFeature({ name: this.name, feature: data })
                                .pipe(first())
                                .subscribe(resp => {
                                    this.features.push(resp.data[0]);
                                });
                    });
            });
        });
        MB.addBtn(subGrp, DOWNLOAD_ICON, "Load", () => {
            draw.changeMode("simple_select");

            if (this.features.length <= 0) return;

            this.openDialog("Load", this.features, () => {
                //if ((this.name ?? "") == "") return;

                const dlgRef = this.dialog.open(Dialog2Component, {
                    data: {
                        title: "Load",
                        text: `Load the features collection "${this.dialogResult.name}" ?`,
                        yes: "OK",
                        cancel: "CANCEL",
                    },
                });

                dlgRef
                    .afterClosed()
                    .pipe(first())
                    .subscribe(resp => {
                        console.log("RESPRESP", resp)
                        if (resp != "yes") return;

                        this.repo
                            .getFeatures(this.dialogResult._id)
                            .pipe(first())
                            .subscribe(resp => {
                                console.log("RESPRESP22", resp);
                                const coll = resp.data[0].feature;

                                this.markers.forEach(v => v.remove());
                                draw.deleteAll();
                                draw.add(coll);
                                coll.features.forEach(v => {
                                    if (v.geometry.type == "Point") {
                                        const marker = new mapboxgl.Marker()
                                            .setLngLat(v.geometry.coordinates as [number, number])
                                            .addTo(mbMap);
                                        this.markers.push(marker);
                                    }

                                })
                                const bounds = this.fit(resp.data[0]);
                                mbMap.fitBounds(bounds, {padding: 50});
                            });
                    });
            });
        });
    }

    private fit = (featCol: IFeatCol) => {
        // Geographic coordinates of the LineString
        const features = featCol.feature.features;
        const coordinates: LngLat[] = [];

        features.forEach(v => {
            const geometry = v.geometry as unknown as {
                coordinates: LngLat | LngLat[] | LngLat[][];
                type: string;
            };

            if (geometry.type == "LineString") {
                coordinates.push(...(geometry.coordinates as LngLat[]));
            } else if (geometry.type == "Point") {
                coordinates.push(geometry.coordinates as LngLat);
            } else {
                (geometry.coordinates as LngLat[][]).forEach(coor =>
                    coordinates.push(...(coor as LngLat[]))
                );
            }
        });

        // Create a 'LngLatBounds' with both corners at the first coordinate.
        const bounds = new mapboxgl.LngLatBounds(
            coordinates[0],
            coordinates[0]
        );

        // Extend the 'LngLatBounds' to include every coordinate in the bounds result.
        for (const coord of coordinates) {
            bounds.extend(coord);
        }

        return bounds;
    };

    private addAttractions = (image: HTMLImageElement | ArrayBufferView | { width: number; height: number; data: Uint8ClampedArray | Uint8Array; } | ImageData | ImageBitmap | undefined) => {
        mbMap.addImage("attraction-marker", image as HTMLImageElement);
    };

    private addRestaurants = () => {};

    openDialog(
        action: string,
        features: IFeatCol[],
        callback: () => void
    ): void {
        const dialogRef = this.dialog.open(MapDialog, {
            data: {
                name: this.dialogResult.name,
                features: features,
                action: action,
            },
        });

        dialogRef.afterClosed().subscribe(result => {
            this.dialogResult = result;
            callback();
        });
    }
}

