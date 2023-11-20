import { Injectable, inject } from "@angular/core";
import { IDataAdapter, Params } from "../adapters/IDataAdapter";
import { environment } from "src/environments/environment";
import { HttpAdapter } from "../adapters/HttpAdapter";
import { IFeatCol } from "src/domain/model/IFeatCol";

@Injectable({
    providedIn: "root",
})
export class FeaturesRepoService {
    private dataSource: IDataAdapter<IFeatCol>;
    private _features: IFeatCol[] = [];
    get features(): IFeatCol[] {
        return this._features;
    }

    constructor() {
        //let a = inject(new HttpAdapter<IUser>());
        this.dataSource = inject(HttpAdapter<IFeatCol>);
        this.dataSource.url = `${environment.url}/features`;
        console.log("HREPOSTORIEFEATURESCONSTRUCTOR");
    }

    // getUsers = () => {
    //     this.dataSource.get().subscribe(users => {
    //         this._users = users.data;
    //     });
    // }
    getFeature = (arg?: string | Params) => this.dataSource.get(arg);
    putFeature = (feature: IFeatCol) => this.dataSource.put(feature);
    addFeature = (feature: IFeatCol) => this.dataSource.post(feature);
    deleteFeature = (id: string) => this.dataSource.delete(id);
}
