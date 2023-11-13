import MapboxDraw, { MapboxDrawOptions, MapboxDrawControls } from "@mapbox/mapbox-gl-draw";
import { FeatureCollection } from "geojson";

type ctrlGroup = "top-left" | "top-right" | "bottom-left" | "bottom-right";

type ctrlType = "line_string" | "polygon" | "point" | "trash";

class Control {
    "id": string;
    "type": string;
    "filter": (string | [string, string, string])[];
}

class ControlLine extends Control {
    override readonly "type" = "line";
    "layout"?: {
        "line-cap"?: "round";
        "line-join"?: "round";
    };
    "paint"?: {
        "line-color"?: string;
        "line-dasharray"?: [number, number];
        "line-width"?: number;
    };
}

class ControlPolygon extends Control {

}

class ControlPoint extends Control {

}
class DrawOptions implements MapboxDrawOptions {
    boxSelect: undefined;
    displayControlsDefault: boolean | undefined = false;
    defaultMode: "draw_line_string" | "draw_polygon" | "draw_point" | "simple_select" | undefined = "simple_select";
    controls: MapboxDrawControls | undefined;
    styles?: object[] | undefined;
}

class DrawControl {
}

export class DrawControlLine extends DrawControl {
    //    override readonly control = "line_string" as const;
    color?: string;
    colorInactive?: string;
    colorStatic?: string;
    dashArray?: [number, number];
    dashArrayInactive?: [number, number];
    dashArrayStatic?: [number, number];
    width?: number;
    widthInactive?: number;
    widthStatic?: number;
}

export class DrawControlPolygon extends DrawControl {}

export class DrawControlPoint extends DrawControl {}

export class DrawControlTrash extends DrawControl {}

export const MB = {
    addSubgroup: (grp: ctrlGroup = "top-right") => {
        const div = document.createElement("div") as HTMLDivElement;
        const group = MB.getCtrlGroup(grp);

        div.classList.add("mapboxgl-ctrl-group", "mapboxgl-ctrl");
        group.append(div);

        return div
        //mapboxgl-ctrl-group mapboxgl-ctrl
    },

    addBtn: (subGrp: HTMLDivElement, icon: string, title: string, callback: () => void) => {

        const btn = document.createElement("button") as HTMLButtonElement;
        //const group = this.getCtrlGroup(grp);
        btn.addEventListener("click", callback);
        btn.classList.add("mapbox-gl-draw_ctrl-draw-btn");
        btn.innerHTML = `<span>${icon}</span>`;
        btn.title = title;
        //console.log("GRP", group)
        subGrp.append(btn)

    },

    getCtrlGroup: (grp: ctrlGroup = "top-right") =>
        document.querySelector(".mapboxgl-ctrl-" + grp) as HTMLDivElement,

    createDraw: (drawOptions?: DrawOptions, ...drawControl: DrawControl[]) => {
        // const mbOptions: MapboxDrawOptions = {
        //     displayControlsDefault: drawOptions.displayControlsDefault,
        //     defaultMode: drawOptions.defaultMode,
        // };
        const mbOptions = drawOptions ?? new DrawOptions();
        const controls: MapboxDraw.MapboxDrawControls = {};
        const styles:  object[] = [];
        const newStyles:  object[] = [];

        drawControl.forEach(ctrl => {

            const type: ctrlType =
                ctrl instanceof DrawControlLine ? "line_string" :
                ctrl instanceof DrawControlPoint ? "point" :
                ctrl instanceof DrawControlTrash ? "trash" :
                "polygon";

            if (controls[type])
                return;

            controls[type] = true;

            switch (type) {
                case "line_string": {
                    newStyles.push(...drawLine(ctrl));
                    break;
                }
                case "trash": {
                    break
                }
                default: {
                    newStyles.push(...drawPolygon());
                }
            }
        })
        styles_all.forEach((obj: {id: string}) => {
            const idx = newStyles.findIndex(v => (v as {id: string}).id == obj.id);
            if (idx < 0)
                styles.push(obj);
            else
                styles.push(newStyles[idx])
        })
        // mbOptions.controls = controls;
        // mbOptions.styles = styles;
        console.log("OPTIONS", styles);
        console.log("mapbox-gl-draw-hot");
        const mbd = new MapboxDraw({...mbOptions, controls: controls, styles: styles});

        return mbd
    }
}

// line stroke
const drawLine = (ctrl: DrawControlLine) => {
    const output: ControlLine[] = [
        {
            // ACTIVE (being drawn)
            id: "gl-draw-line-active",
            type: "line",
            filter: [
                "all",
                ["==", "$type", "LineString"],
                ["==", "active", "true"],
            ],
            layout: {
                "line-cap": "round",
                "line-join": "round",
            },
            paint: {
                // "line-color": "#D20C0C",
                // "line-dasharray": [0.2, 2],
                // "line-width": 3,
            },
        },
        {
            // ACTIVE (being drawn)
            id: "gl-draw-line-inactive",
            type: "line",
            filter: [
                "all",
                ["==", "$type", "LineString"],
                ["==", "active", "false"],
                ["!=", "mode", "static"],
            ],
            layout: {
                "line-cap": "round",
                "line-join": "round",
            },
            paint: {
                // "line-color": "#D20C0C",
                // "line-dasharray": [0.2, 2],
                // "line-width": 3,
            },
        },
        {
            // INACTIVE (static, already drawn)
            id: "gl-draw-line-static",
            type: "line",
            filter: [
                "all",
                ["==", "$type", "LineString"],
                ["==", "mode", "static"],
            ],
            layout: {
                "line-cap": "round",
                "line-join": "round",
            },
            paint: {
                //     "line-color": "#D20C0C",
                //    "line-dasharray": [0.2, 2],
                //     "line-width": 3,
            },
        },
    ];

    output[0].paint!["line-color"] = ctrl.color ?? "#D20C0C"; // Active
    output[1].paint!["line-color"] = ctrl.colorInactive ?? "#04a3a3"; // Inactive
    output[2].paint!["line-color"] = ctrl.colorStatic ?? "#0000ff"; // Static

    output[0].paint!["line-dasharray"] = ctrl.dashArray ?? [2, 4]; // Active
    output[1].paint!["line-dasharray"] = ctrl.dashArrayInactive ?? [0, 1]; // Inactive
    output[2].paint!["line-dasharray"] = ctrl.dashArrayStatic ?? [4, 4]; // Static

    output[0].paint!["line-width"] = ctrl.width ?? 2; // Active
    output[1].paint!["line-width"] = ctrl.widthInactive ?? 4; // Inactive
    output[2].paint!["line-width"] = ctrl.widthStatic ?? 4; // Static

    return output;
};

const drawPolygon = () => [
    // ACTIVE (being drawn)
    // polygon fill
    {
        id: "gl-draw-polygon-fill",
        type: "fill",
        filter: ["all", ["==", "$type", "Polygon"], ["!=", "mode", "static"]],
        paint: {
            "fill-color": "#D20C0C",
            "fill-outline-color": "#D20C0C",
            "fill-opacity": 0.1,
        },
    },
    // polygon mid points
    {
        id: "gl-draw-polygon-midpoint",
        type: "circle",
        filter: ["all", ["==", "$type", "Point"], ["==", "meta", "midpoint"]],
        paint: {
            "circle-radius": 3,
            "circle-color": "#fbb03b",
        },
    },
    // polygon outline stroke
    // This doesn't style the first edge of the polygon, which uses the line stroke styling instead
    {
        id: "gl-draw-polygon-stroke-active",
        type: "line",
        filter: ["all", ["==", "$type", "Polygon"], ["!=", "mode", "static"]],
        layout: {
            "line-cap": "round",
            "line-join": "round",
        },
        paint: {
            "line-color": "#D20C0C",
            "line-dasharray": [0.2, 2],
            "line-width": 3,
        },
    },
    // vertex point halos
    {
        id: "gl-draw-polygon-and-line-vertex-halo-active",
        type: "circle",
        filter: [
            "all",
            ["==", "meta", "vertex"],
            ["==", "$type", "Point"],
            ["!=", "mode", "static"],
        ],
        paint: {
            "circle-radius": 5,
            "circle-color": "#FFF",
        },
    },
    // vertex points
    {
        id: "gl-draw-polygon-and-line-vertex-active",
        type: "circle",
        filter: [
            "all",
            ["==", "meta", "vertex"],
            ["==", "$type", "Point"],
            ["!=", "mode", "static"],
        ],
        paint: {
            "circle-radius": 3,
            "circle-color": "#D20C0C",
        },
    },

    // INACTIVE (static, already drawn)
    // // line stroke
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
        id: "gl-draw-polygon-fill-static",
        type: "fill",
        filter: ["all", ["==", "$type", "Polygon"], ["==", "mode", "static"]],
        paint: {
            "fill-color": "#000",
            "fill-outline-color": "#000",
            "fill-opacity": 0.1,
        },
    },
    // polygon outline
    {
        id: "gl-draw-polygon-stroke-static",
        type: "line",
        filter: ["all", ["==", "$type", "Polygon"], ["==", "mode", "static"]],
        layout: {
            "line-cap": "round",
            "line-join": "round",
        },
        paint: {
            "line-color": "#f00",
            "line-width": 10,
        },
    },
];

const styles_all = [
  {
    'id': 'gl-draw-polygon-fill-inactive',
    'type': 'fill',
    'filter': ['all',
      ['==', 'active', 'false'],
      ['==', '$type', 'Polygon'],
      ['!=', 'mode', 'static']
    ],
    'paint': {
      'fill-color': '#3bb2d0',
      'fill-outline-color': '#3bb2d0',
      'fill-opacity': 0.1
    }
  },
  {
    'id': 'gl-draw-polygon-fill-active',
    'type': 'fill',
    'filter': ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
    'paint': {
      'fill-color': '#fbb03b',
      'fill-outline-color': '#fbb03b',
      'fill-opacity': 0.1
    }
  },
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
  {
    'id': 'gl-draw-polygon-stroke-inactive',
    'type': 'line',
    'filter': ['all',
      ['==', 'active', 'false'],
      ['==', '$type', 'Polygon'],
      ['!=', 'mode', 'static']
    ],
    'layout': {
      'line-cap': 'round',
      'line-join': 'round'
    },
    'paint': {
      'line-color': '#3bb2d0',
      'line-width': 2
    }
  },
  {
    'id': 'gl-draw-polygon-stroke-active',
    'type': 'line',
    'filter': ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
    'layout': {
      'line-cap': 'round',
      'line-join': 'round'
    },
    'paint': {
      'line-color': '#fbb03b',
      'line-dasharray': [0.2, 2],
      'line-width': 2
    }
  },
  {
    'id': 'gl-draw-line-inactive',
    'type': 'line',
    'filter': ['all',
      ['==', 'active', 'false'],
      ['==', '$type', 'LineString'],
      ['!=', 'mode', 'static']
    ],
    'layout': {
      'line-cap': 'round',
      'line-join': 'round'
    },
    'paint': {
      'line-color': '#3bb2d0',
      'line-width': 2
    }
  },
  {
    'id': 'gl-draw-line-active',
    'type': 'line',
    'filter': ['all',
      ['==', '$type', 'LineString'],
      ['==', 'active', 'true']
    ],
    'layout': {
      'line-cap': 'round',
      'line-join': 'round'
    },
    'paint': {
      'line-color': '#fbb03b',
      'line-dasharray': [0.2, 2],
      'line-width': 2
    }
  },
  {
    'id': 'gl-draw-polygon-and-line-vertex-stroke-inactive',
    'type': 'circle',
    'filter': ['all',
      ['==', 'meta', 'vertex'],
      ['==', '$type', 'Point'],
      ['!=', 'mode', 'static']
    ],
    'paint': {
      'circle-radius': 5,
      'circle-color': '#fff'
    }
  },
  {
    'id': 'gl-draw-polygon-and-line-vertex-inactive',
    'type': 'circle',
    'filter': ['all',
      ['==', 'meta', 'vertex'],
      ['==', '$type', 'Point'],
      ['!=', 'mode', 'static']
    ],
    'paint': {
      'circle-radius': 3,
      'circle-color': '#fbb03b'
    }
  },
  {
    'id': 'gl-draw-point-point-stroke-inactive',
    'type': 'circle',
    'filter': ['all',
      ['==', 'active', 'false'],
      ['==', '$type', 'Point'],
      ['==', 'meta', 'feature'],
      ['!=', 'mode', 'static']
    ],
    'paint': {
      'circle-radius': 5,
      'circle-opacity': 1,
      'circle-color': '#fff'
    }
  },
  {
    'id': 'gl-draw-point-inactive',
    'type': 'circle',
    'filter': ['all',
      ['==', 'active', 'false'],
      ['==', '$type', 'Point'],
      ['==', 'meta', 'feature'],
      ['!=', 'mode', 'static']
    ],
    'paint': {
      'circle-radius': 3,
      'circle-color': '#3bb2d0'
    }
  },
  {
    'id': 'gl-draw-point-stroke-active',
    'type': 'circle',
    'filter': ['all',
      ['==', '$type', 'Point'],
      ['==', 'active', 'true'],
      ['!=', 'meta', 'midpoint']
    ],
    'paint': {
      'circle-radius': 7,
      'circle-color': '#fff'
    }
  },
  {
    'id': 'gl-draw-point-active',
    'type': 'circle',
    'filter': ['all',
      ['==', '$type', 'Point'],
      ['!=', 'meta', 'midpoint'],
      ['==', 'active', 'true']],
    'paint': {
      'circle-radius': 5,
      'circle-color': '#fbb03b'
    }
  },
  {
    'id': 'gl-draw-polygon-fill-static',
    'type': 'fill',
    'filter': ['all', ['==', 'mode', 'static'], ['==', '$type', 'Polygon']],
    'paint': {
      'fill-color': '#404040',
      'fill-outline-color': '#404040',
      'fill-opacity': 0.1
    }
  },
  {
    'id': 'gl-draw-polygon-stroke-static',
    'type': 'line',
    'filter': ['all', ['==', 'mode', 'static'], ['==', '$type', 'Polygon']],
    'layout': {
      'line-cap': 'round',
      'line-join': 'round'
    },
    'paint': {
      'line-color': '#404040',
      'line-width': 2
    }
  },
  {
    'id': 'gl-draw-line-static',
    'type': 'line',
    'filter': ['all', ['==', 'mode', 'static'], ['==', '$type', 'LineString']],
    'layout': {
      'line-cap': 'round',
      'line-join': 'round'
    },
    'paint': {
      'line-color': '#404040',
      'line-width': 2
    }
  },
  {
    'id': 'gl-draw-point-static',
    'type': 'circle',
    'filter': ['all', ['==', 'mode', 'static'], ['==', '$type', 'Point']],
    'paint': {
      'circle-radius': 5,
      'circle-color': '#404040'
    }
  }
];

export const feat: FeatureCollection = {
    type: "FeatureCollection",
    features: [
        {
            id: "75379f636d800c9ef214aeeb1ce4745e",
            type: "Feature",
            properties: {},
            geometry: {
                coordinates: [
                    [2.1374541893445382, 41.377906669189684],
                    [2.1346637935095885, 41.3750718996892],
                    [2.13590873934362, 41.37275245093096],
                    [2.137625906011124, 41.37288131136489],
                ],
                type: "LineString",
            },
        },
        {
            id: "25183a5fc75dcd548107eb9be51395b4",
            type: "Feature",
            properties: {},
            geometry: {
                coordinates: [
                    [
                        [2.1323456185089924, 41.37172155826934],
                        [2.1335047060097168, 41.36782334771732],
                        [2.137754693510658, 41.3695952905602],
                        [2.1411031685124158, 41.37078729768339],
                        [2.1323456185089924, 41.37172155826934],
                    ],
                ],
                type: "Polygon",
            },
        },
    ],
};
