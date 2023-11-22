import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { HttpAdapter } from 'src/infrastructure/adapters/HttpAdapter';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { environment } from 'src/environments/environment';
import MapboxDraw from '@mapbox/mapbox-gl-draw';

export const appConfig: ApplicationConfig = {

    providers: [
        provideRouter(routes),
        provideAnimations(),
        provideHttpClient(),
        HttpAdapter,
        importProvidersFrom(
            NgxMapboxGLModule.withConfig({
                accessToken: environment.mapbox,
            })
        ),
        importProvidersFrom(MapboxDraw),
    ],
};
