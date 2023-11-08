import MapboxDraw from "@mapbox/mapbox-gl-draw";

type ctrlGroup = "top-left" | "top-right" | "bottom-left" | "bottom-right";
class drawOptions {
    displayControlsDefault: boolean | undefined = false;
    defaultMode: "draw_line_string" | "draw_polygon" | undefined = "draw_line_string";
}
type drawControl = {control: "line_string" | "polygon"}

export const MB = {
    addSubgroup: (grp: ctrlGroup = "top-right") => {
        const div = document.createElement("div") as HTMLDivElement;
        const group = MB.getCtrlGroup(grp);

        div.classList.add("mapboxgl-ctrl-group", "mapboxgl-ctrl");
        group.append(div);

        return div
        //mapboxgl-ctrl-group mapboxgl-ctrl
    },

    addBtn: (subGrp: HTMLDivElement, icon: string) => {

        const btn = document.createElement("button") as HTMLButtonElement;
        //const group = this.getCtrlGroup(grp);

        btn.classList.add("mapbox-gl-draw_ctrl-draw-btn");
        btn.innerHTML = `<span>${icon}</span>`
        //console.log("GRP", group)
        subGrp.append(btn)

    },

    getCtrlGroup: (grp: ctrlGroup = "top-right") =>
        document.querySelector(".mapboxgl-ctrl-" + grp) as HTMLDivElement,

    createDraw: (drawOptions: drawOptions, ...drawControl: drawControl[]) => {
        const md = new MapboxDraw({
            displayControlsDefault: drawOptions.displayControlsDefault,
            defaultMode: drawOptions.defaultMode
        })
        const controls: MapboxDraw.MapboxDrawControls = {};
        const styles:  object[] = [];

        drawControl.forEach(ctrl => {
            controls[ctrl.control] = true;
            switch(ctrl.control) { 
                case "line_string": { 
                   styles.push(drawLine())
                   break; 
                } 
                default: { 
                    styles.push(drawPolygon())
                } 
             } 
            styles.push()
        })
    }


   
}


// line stroke
const drawLine = () => ([
    {   // ACTIVE (being drawn)
        "id": "gl-draw-line",
        "type": "line",
        "filter": ["all", ["==", "$type", "LineString"], ["!=", "mode", "static"]],
        // "layout": {
        //     "line-cap": "round",
        //     "line-join": "round"
        // },
        //"paint": {
        //     "line-color": "#D20C0C",
        //    "line-dasharray": [0.2, 2],
        //     "line-width": 3,
        //}
    },
    {// INACTIVE (static, already drawn)
        "id": "gl-draw-line",
        "type": "line",
        "filter": ["all", ["==", "$type", "LineString"], ["==", "mode", "static"]],
        // "layout": {
        //     "line-cap": "round",
        //     "line-join": "round"
        // },
        //"paint": {
        //     "line-color": "#D20C0C",
        //    "line-dasharray": [0.2, 2],
        //     "line-width": 3,
        //}
    }
]);

const drawPolygon = () => ([

]);

new MapboxDraw({
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
