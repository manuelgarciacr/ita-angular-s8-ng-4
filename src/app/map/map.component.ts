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

const SAVE_ICON = '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M840-680v480q0 33-23.5 56.5T760-120H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h480l160 160Zm-80 34L646-760H200v560h560v-446ZM480-240q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35ZM240-560h360v-160H240v160Zm-40-86v446-560 114Z"/></svg>'
const draw = new MapboxDraw({
    // other draw options here
    // ...
    displayControlsDefault: false,
    // Select which mapbox-gl-draw control buttons to add to the map.
    controls: {
        line_string: true,
        polygon: true,
        trash: true,
    },
    // Set mapbox-gl-draw to draw by default.
    // The user does not have to click the polygon control button first.
    defaultMode: "draw_line_string",
    
    // styles here
    // ...
    styles: [
      // ACTIVE (being drawn)
      // line stroke
      {
          "id": "gl-draw-line",
          "type": "line",
          "filter": ["all", ["==", "$type", "LineString"], ["!=", "mode", "static"]],
          "layout": {
            "line-cap": "round",
            "line-join": "round"
          },
          "paint": {
            "line-color": "#D20C0C",
            "line-dasharray": [0.2, 2],
            "line-width": 3,
          }
      },
      // polygon fill
      {
        "id": "gl-draw-polygon-fill",
        "type": "fill",
        "filter": ["all", ["==", "$type", "Polygon"], ["!=", "mode", "static"]],
        "paint": {
          "fill-color": "#D20C0C",
          "fill-outline-color": "#D20C0C",
          "fill-opacity": 0.1
        }
      },
      // polygon mid points
      {
        'id': 'gl-draw-polygon-midpoint',
        'type': 'circle',
        'filter': ['all',
          ['==', '$type', 'Point'],
          ['==', 'meta', 'midpoint']],
        'paint': {
          'circle-radius': 3,
          'circle-color': '#fbb03b'
        }
      },
      // polygon outline stroke
      // This doesn't style the first edge of the polygon, which uses the line stroke styling instead
      {
        "id": "gl-draw-polygon-stroke-active",
        "type": "line",
        "filter": ["all", ["==", "$type", "Polygon"], ["!=", "mode", "static"]],
        "layout": {
          "line-cap": "round",
          "line-join": "round"
        },
        "paint": {
          "line-color": "#D20C0C",
          "line-dasharray": [0.2, 2],
          "line-width": 3
        }
      },
      // vertex point halos
      {
        "id": "gl-draw-polygon-and-line-vertex-halo-active",
        "type": "circle",
        "filter": ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
        "paint": {
          "circle-radius": 5,
          "circle-color": "#FFF"
        }
      },
      // vertex points
      {
        "id": "gl-draw-polygon-and-line-vertex-active",
        "type": "circle",
        "filter": ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
        "paint": {
          "circle-radius": 3,
          "circle-color": "#D20C0C",
        }
      },
  
      // INACTIVE (static, already drawn)
      // line stroke
    //   {
    //       "id": "gl-draw-line-static",
    //       "type": "line",
    //       "filter": ["all", ["==", "$type", "LineString"], ["==", "mode", "static"]],
    //       "layout": {
    //         "line-cap": "round",
    //         "line-join": "round"
    //       },
    //       "paint": {
    //         "line-color": "#000",
    //         "line-width": 4
    //       }
    //   },
      // polygon fill
      {
        "id": "gl-draw-polygon-fill-static",
        "type": "fill",
        "filter": ["all", ["==", "$type", "Polygon"], ["==", "mode", "static"]],
        "paint": {
          "fill-color": "#000",
          "fill-outline-color": "#000",
          "fill-opacity": 0.1
        }
      },
      // polygon outline
      {
        "id": "gl-draw-polygon-stroke-static",
        "type": "line",
        "filter": ["all", ["==", "$type", "Polygon"], ["==", "mode", "static"]],
        "layout": {
          "line-cap": "round",
          "line-join": "round"
        },
        "paint": {
          "line-color": "#f00",
          "line-width": 10
        }
      }
    ]
  });

type ctrlGroup = "top-left" | "top-right" | "bottom-left" | "bottom-right";

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
        const subGrp = this.addSubgroup()
        this.addBtn(subGrp, SAVE_ICON)
    }

    updateArea = (e) => {
        console.log("DCR", e.features);

        const data = draw.getAll();
        const answer = document.getElementById('calculated-area');
        if (data.features.length > 0) {
            const area = turf.area(data);
            // Restrict the area to 2 decimal points.
            const rounded_area = Math.round(area * 100) / 100;
            answer.innerHTML = `<p><strong>${rounded_area}</strong></p><p>square meters</p>`;
        } else {
            answer.innerHTML = '';
            if (e.type !== 'draw.delete')
                alert('Click the map to draw a polygon.');
        }
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
        btn.innerHTML = `<span>${icon}</span>`
        //console.log("GRP", group)
        subGrp.append(btn)

    }

    getCtrlGroup = (grp: ctrlGroup = "top-right") =>
        document.querySelector(".mapboxgl-ctrl-" + grp) as HTMLDivElement;

}
