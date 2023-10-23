import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    //NgbDropdownModule,
    NgbCollapse,
} from "@ng-bootstrap/ng-bootstrap";
import { MatTabsModule } from "@angular/material/tabs";
import { noDragging } from 'src/utils/noDragging';
import { ActivatedRoute, NavigationEnd, Route, Router, RouterEvent, RouterLink, RouterLinkActive } from '@angular/router';
import { routes } from 'src/app/app.routes';
import { Subscription, filter } from 'rxjs';

@Component({
    selector: "navbar",
    standalone: true,
    templateUrl: "./navbar.component.html",
    styles: [],
    imports: [
        CommonModule,
        //NgbDropdownModule,
        NgbCollapse,
        RouterLink,
        RouterLinkActive,
        MatTabsModule,
    ],
})
export class NavbarComponent implements OnInit, OnDestroy {
    protected isMenuCollapsed = true;
    links = routes.map(route => route.path).filter(r => r != "" && r != "**"); //["Home", "Map", "Full Calendar", "Graphics"];
    activeLink = this.links[0];
    private navigation$: Subscription;
    // protected themeState = {
    //     svg: ["moon-stars-fill", "sun-fill"],
    //     alt: ["Moon icon", "Sun icon"],
    //     title: ["Set the dark theme", "Set the light theme"],
    //     state: 0, // 0: Light theme set, the icon shows the moon.
    // };
    // protected langState = {
    //     svg: ["es", "en"],
    //     alt: ["Spanish flag", "British flag"],
    //     title: ["Set the english language", "Set the spanish language"],
    //     state: 0, // 0: English language set, the icon shows the spanish flag.
    // };
    //protected paths: Route[] = [] = routes;

    constructor(
        //private conf: ConfigurationService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {
        //this.setThemeState(conf.theme);
        //this.setLangState(conf.locale);
        //this.paths = routes;
        this.navigation$ = this.router.events
            .pipe(
                filter(
                    (event): event is NavigationEnd =>
                        event instanceof NavigationEnd
                )
            )
            .subscribe(ev =>
                this.activeLink = ev.urlAfterRedirects.substring(1)
            );
    }

    ngOnInit(): void {
        noDragging();
    }

    ngOnDestroy(): void {
        this.navigation$.unsubscribe();
    }

    // protected toggleTheme() {
    //     this.setThemeState(this.conf.toggleTheme());
    // }

    // private setThemeState(theme: string) {
    //     if (theme == "light") this.themeState.state = 0;
    //     else this.themeState.state = 1;
    // }

    // protected toggleLang() {
    //     this.setLangState(this.conf.toggleLocale());
    // }

    // private setLangState(lang: string) {
    //     console.group("SLS", lang);
    //     if (lang == "en") this.langState.state = 0;
    //     else this.langState.state = 1;
    // }
}
