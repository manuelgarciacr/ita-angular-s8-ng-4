import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: "home",
        loadComponent: () =>
            import("./home/home.component").then(c => c.HomeComponent),
        data: { animation: "isHome" }, // trn: Tag for translation
    },
    {
        path: "map",
        loadComponent: () =>
            import("./map/map.component").then(c => c.MapComponent),
        data: { animation: "isMap" },
        //canActivate: [authGuard],
    },
    {
        path: "calendar",
        loadComponent: () =>
            import("./calendar/calendar.component").then(c => c.CalendarComponent),
        data: { animation: "isCalendar" },
        //canActivate: [authGuard],
    },
    {
        path: "graphics",
        loadComponent: () =>
            import("./graphics/graphics.component").then(c => c.GraphicsComponent),
        data: { animation: "isGraphics" },
        //canActivate: [authGuard],
    },
    { path: "", redirectTo: "/home", pathMatch: "full" },
    {
        path: "**",
        loadComponent: () =>
            import("./e404/e404.component").then(c => c.E404Component),
    },
];
