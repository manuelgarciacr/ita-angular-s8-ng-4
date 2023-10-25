import { Component, OnInit, Renderer2, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatTableDataSource, MatTableModule, MatTableDataSourcePaginator } from "@angular/material/table";
import { MatSort, MatSortModule, Sort } from "@angular/material/sort";
import { UsersRepoService } from "src/infrastructure/repositories/users-repo.service";
import { IUser } from "src/domain/model/IUser";
import { UserComponent } from "src/app/home/user/user.component";
import {
    MatDialog,
    MatDialogRef,
    MatDialogModule,
} from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { LiveAnnouncer } from "@angular/cdk/a11y";


type Element = {
    position: number;
    user: IUser;
    //action: string
};

@Component({
    standalone: true,
    imports: [
        CommonModule,
        MatTableModule,
        MatSortModule,
        MatButtonModule,
        MatDialogModule,
        MatPaginatorModule,
    ],
    templateUrl: "home.component.html",
    styleUrls: ["home.component.scss"],
})
export class HomeComponent implements OnInit {
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    displayedColumns: string[] = [
        "position",
        "firstName",
        "lastName",
        "email",
        "password",
        "role",
        "actions",
    ];
    dataSource = new MatTableDataSource<Element>();

    constructor(
        private repo: UsersRepoService,
        private dialog: MatDialog,
        private _liveAnnouncer: LiveAnnouncer
    ) {}

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    ngOnInit(): void {
        this.repo.getUsers().subscribe(
            users =>
                (this.dataSource.data = users.data.map((user, i) => ({
                    position: i + 1,
                    user,
                })))
        );
    }

    // Edit and Delete
    actualize(element: Element, action: string): void {
        //const { position, ...user } = data;
        this.dialog
            .open(UserComponent, {
                enterAnimationDuration: "1000ms",
                exitAnimationDuration: "500ms",
                panelClass: "my-outlined-dialog",
                // data: {
                //     action: action,
                //     title: "Edit user",
                //     position,
                //     user,
                // },
                data: { ...element, action },
            })
            .afterClosed()
            .subscribe(result => {
                console.log(action + " dialog result: ", result);
                this.ngOnInit();
            });
    }

    // delete(data: { position: number; user: IUser }): void {
    //     const { position, ...user } = data;
    //     this.dialog
    //         .open(UserComponent, {
    //             enterAnimationDuration: "1000ms",
    //             exitAnimationDuration: "500ms",
    //             panelClass: "my-outlined-dialog",
    //             data: {
    //                 action: "delete",
    //                 title: "Delete user",
    //                 position,
    //                 user,
    //             },
    //         })
    //         .afterClosed()
    //         .subscribe(result => {
    //             console.log("Delete dialog result: ", result);
    //             this.ngOnInit();
    //         });
    // }

    add(): void {
        this.dialog
            .open(UserComponent, {
                enterAnimationDuration: "1000ms",
                exitAnimationDuration: "500ms",
                panelClass: "my-outlined-dialog",
                data: {
                    position: 0,
                    user: {
                        email: "",
                        firstName: "",
                        lastName: "",
                        password: "",
                    } as IUser,
                    action: "Add",
                },
            })
            .afterClosed()
            .subscribe(result => {
                console.log("Add dialog result: ", result);
                this.ngOnInit();
            });
    }

    /** Announce the change in sort state for assistive technology. */
    announceSortChange(sortState: Sort) {
        console.log("ANNOUN", sortState)
        if (sortState.direction) {
            this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
        } else {
            this._liveAnnouncer.announce("Sorting cleared");
        }
    }
}
