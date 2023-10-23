import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "../infrastructure/components/navbar/navbar.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [CommonModule, RouterOutlet, NavbarComponent] //, TranslateModule],
})
export class AppComponent {
    title = 'ita-angular-s8-ng-4';
    //param = { value: 'world'};

    constructor(
        //translate: TranslateService,
    ) {
        //translate.setDefaultLang('en');
        //translate.use(conf.locale);

        // translate.get('HOME.world').subscribe((res: string) => {
        //     this.param['value'] = res
        //     console.log("RES", res)
        //     //=> 'hello world'
        // });
    }
}