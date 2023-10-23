import { Injectable } from "@angular/core";
import { UsersRepoService } from "src/infrastructure/repositories/users-repo.service";

// const httpOptions = {
//     headers: new HttpHeaders({
//         "Content-Type": "application/json",
//         //Authorization: 'my-auth-token',
//     }),
//     observe: "response" as const,
//     params: {},
//     reportProgress: false,
//     responseType: "json" as const,
//     withCredentials: false,
// };

@Injectable({
    providedIn: "root",
})
export class UsersService {

    constructor(private usersRepo: UsersRepoService) { }

    //getUsers = () => this.usersRepo.getUsers();
    // //** GET starships from the server by URL */
    // getUsers(
    //     urlParm: string | null
    // ): Observable<HttpResponse<ISwapiResp>> {
    //     const emptyResp = new HttpResponse<ISwapiResp>({});
    //     const endPoint = "starships";

    //     if (urlParm && !this.checkUrl("getStarshipsByUrl", endPoint, urlParm))
    //         return of(emptyResp);

    //     if (urlParm == null) urlParm = this.url + "/" + endPoint;

    //     return this.http
    //         .get<ISwapiResp>(urlParm, httpOptions)
    //         .pipe(
    //             retry({ count: 2, delay: this.shouldRetry }),
    //             catchError(
    //                 this.handleError(
    //                     "getStarships",
    //                     new HttpResponse<ISwapiResp>({})
    //                 )
    //             )
    //         );
    // }
}
