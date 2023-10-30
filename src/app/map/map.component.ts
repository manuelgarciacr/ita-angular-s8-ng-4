import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { environment } from 'src/environments/environment';
import { LngLat, Map as MbMap } from 'mapbox-gl';
import * as MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as mapboxgl from 'mapbox-gl';

const draw = new MapboxDraw({
    displayControlsDefault: false,
    // Select which mapbox-gl-draw control buttons to add to the map.
    controls: {
        line_string: true,
        polygon: true,
        trash: true,
    },
    // Set mapbox-gl-draw to draw by default.
    // The user does not have to click the polygon control button first.
    defaultMode: "draw_line",
});

@Component({
    standalone: true,
    imports: [CommonModule, NgxMapboxGLModule],
    templateUrl: "map.component.html",
    styleUrls: ["map.component.scss"],
})
export class MapComponent implements OnInit {
    protected lngLat: LngLat = new LngLat(2.154007, 41.390205);
    protected map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v12",
        center: this.lngLat,
        zoom: 12,
    })();
    protected draw = new MapboxDraw();

    ngOnInit(): void {
        navigator.geolocation.watchPosition(
            res =>
                (this.lngLat = new LngLat(
                    res.coords.longitude,
                    res.coords.latitude
                ))
        );
        this.map.addControl(this.draw, "top-left");
        this.map.once("load", ev => {
            console.log("WW", ev);
        });
        console.log("AAA");
    }
}
