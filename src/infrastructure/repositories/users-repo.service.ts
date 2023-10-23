import { Injectable, inject } from "@angular/core";
import { IDataAdapter, Params } from "../adapters/IDataAdapter";
import { environment } from "src/environments/environment";
import { HttpAdapter } from "../adapters/HttpAdapter";
import { IUser } from "../../domain/model/IUser";
//import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: "root",
})
export class UsersRepoService {
    private dataSource: IDataAdapter<IUser>;
    private _users: IUser[] = [];
    get users(): IUser[] {
        return this._users;
    }

    constructor() {
        //let a = inject(new HttpAdapter<IUser>());
        this.dataSource = inject(HttpAdapter<IUser>);
        this.dataSource.url = `${environment.url}/users`;
    }

    // getUsers = () => {
    //     this.dataSource.get().subscribe(users => {
    //         this._users = users.data;
    //     });
    // }
    getUsers = (arg?: string | Params) => this.dataSource.get(arg);
    //getUserByEmail = (email: string) => this.dataSource.get(email);
    putUser = (user: IUser) => this.dataSource.put(user);
}
