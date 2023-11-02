import { AfterViewInit, Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgxMapboxGLModule } from "ngx-mapbox-gl";
import { environment } from "src/environments/environment";
import { LngLat, Map as MbMap } from "mapbox-gl";
//import MapboxDraw from "@mapbox/mapbox-gl-draw";
import mapboxgl from "mapbox-gl";
import { start } from "@popperjs/core";
import MapboxDraw from "@mapbox/mapbox-gl-draw";

type ctrlGroup = "top-left" | "top-right" | "bottom-left" | "bottom-right";

let lngLat: LngLat = new LngLat(2.154007, 41.390205);
let map: MbMap;
let draw = new MapboxDraw({
    displayControlsDefault: false,
    // Select which mapbox-gl-draw control buttons to add to the map.
    controls: {
        line_string: true,
        polygon: true,
        trash: true,
    },
    // Set mapbox-gl-draw to draw by default.
    // The user does not have to click the polygon control button first.
    //defaultMode: "draw_line",
});

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
            zoom: 12,
        });

        map.on("draw.create", function (e) {
            console.log("DCR", e.features);
        });
    }

    ngAfterViewInit(): void {
        map.addControl(draw, "top-right");
        const subGrp = this.addSubgroup()
        this.addBtn(subGrp, "save")
    }

    addSubgroup = (grp: ctrlGroup = "top-right") => {
        const div = document.createElement("div") as HTMLDivElement;
        const group = this.getCtrlGroup(grp);

        div.classList.add("mapboxgl-ctrl-group", "mapboxgl-ctrl");
        group.append(div);

        return div
        //mapboxgl-ctrl-group mapboxgl-ctrl
    }

    addBtn = (subGrp: HTMLDivElement, icon: string) => {

        const btn = document.createElement("button") as HTMLButtonElement;
        //const group = this.getCtrlGroup(grp);

        btn.classList.add("mapbox-gl-draw_ctrl-draw-btn");
        btn.innerHTML = `<span class='material-symbols-outlined'>${icon}</span>`
        //console.log("GRP", group)
        subGrp.append(btn)

    }

    getCtrlGroup = (grp: ctrlGroup = "top-right") =>
        document.querySelector(".mapboxgl-ctrl-" + grp) as HTMLDivElement;

}
