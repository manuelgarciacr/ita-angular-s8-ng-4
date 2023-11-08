import { AfterViewInit, Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgxMapboxGLModule } from "ngx-mapbox-gl";
import { environment } from "src/environments/environment";
import { LngLat, Map as MbMap } from "mapbox-gl";
//import MapboxDraw from "@mapbox/mapbox-gl-draw";
import mapboxgl from "mapbox-gl";
import { start } from "@popperjs/core";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import * as turf from '@turf/turf';
import { MB } from "src/utils/Mapbox";

const SAVE_ICON = '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M840-680v480q0 33-23.5 56.5T760-120H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h480l160 160Zm-80 34L646-760H200v560h560v-446ZM480-240q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35ZM240-560h360v-160H240v160Zm-40-86v446-560 114Z"/></svg>'



let lngLat: LngLat = new LngLat(2.154007, 41.390205);
let map: MbMap;
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
    imports: [CommonModule, NgxMapboxGLModule],
    templateUrl: "map.component.html",
    styleUrls: ["map.component.scss"],
})
export class MapComponent implements OnInit, AfterViewInit {

    constructor() {

    }

    ngOnInit(): void {
        mapboxgl.accessToken = environment.mapbox;
        // navigator.geolocation.watchPosition(
        //     res =>
        //         (lngLat = new LngLat(res.coords.longitude, res.coords.latitude))
        // );

        map = new mapboxgl.Map({
            container: "map",
            style: "mapbox://styles/mapbox/streets-v12",
            center: lngLat,
            zoom: 14,
        });

        map.on('draw.create', this.updateArea);
        map.on('draw.delete', this.updateArea);
        map.on('draw.update', this.updateArea);
    }

    ngAfterViewInit(): void {
        map.addControl(draw, "top-right");
        const subGrp = MB.addSubgroup()
        MB.addBtn(subGrp, SAVE_ICON)
    }

    private save = () => console.log()
    updateArea = (e: { features: any; type: string; }) => {
        console.log("DCR", e.features);

        const data = draw.getAll();
        const answer = document.getElementById('calculated-area');
        if (data.features.length > 0) {
            const area = turf.area(data);
            // Restrict the area to 2 decimal points.
            const rounded_area = Math.round(area * 100) / 100;
            // answer?.innerHTML = `<p><strong>${rounded_area}</strong></p><p>square meters</p>`;
        } else {
            // answer.innerHTML = '';
            if (e.type !== 'draw.delete')
                alert('Click the map to draw a polygon.');
        }
    }

    

}
