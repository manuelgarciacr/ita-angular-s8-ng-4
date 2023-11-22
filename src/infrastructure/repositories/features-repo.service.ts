import { Injectable, inject } from "@angular/core";
import { IDataAdapter, Params } from "../adapters/IDataAdapter";
import { environment } from "src/environments/environment";
import { HttpAdapter } from "../adapters/HttpAdapter";
import { IFeatCol } from "src/domain/model/IFeatCol";
import { map } from "rxjs";

const URL = `${environment.url}/features`;

@Injectable({
    providedIn: "root",
})
export class FeaturesRepoService {
    private dataSource: IDataAdapter<IFeatCol> = inject(HttpAdapter);
    private _features: IFeatCol[] = [];
    get features(): IFeatCol[] {
        return this._features;
    }

    getFeatures = (arg?: string | Params) => this.dataSource.get(URL, arg);
    putFeature = (feature: IFeatCol) => this.dataSource.put(URL, feature);
    addFeature = (feature: IFeatCol) => this.dataSource.post(URL, feature);
    deleteFeature = (id: string) => this.dataSource.delete(URL, id);
}
