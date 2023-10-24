import { Component, OnInit, Renderer2, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatTableDataSource, MatTableModule, MatTableDataSourcePaginator } from "@angular/material/table";
import { MatSortModule } from "@angular/material/sort";
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
    displayedColumns: string[] = [
        "position",
        "firstName",
        "lastName",
        "email",
        "password",
        "role",
        "actions",
    ];
    dataSource = new MatTableDataSource<IUser>();

    constructor(private repo: UsersRepoService, private dialog: MatDialog) {}

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

    ngOnInit(): void {
        this.repo.getUsers().subscribe(
            users =>
                (this.dataSource.data = users.data.map((u, i) => ({
                    position: i + 1,
                    ...u,
                })))
        );
    }

    edit(
        data: { position: number; user: IUser },
    ): void {
        const { position, ...user } = data;
        this.dialog
            .open(UserComponent, {
                enterAnimationDuration: "1000ms",
                exitAnimationDuration: "500ms",
                panelClass: "my-outlined-dialog",
                data: { action: "edit", title: "Edit user", position, user },
            })
            .afterClosed()
            .subscribe(result => {
                console.log("Edit dialog result: ", result);
                this.ngOnInit();
            });
    }

    addUser(
    ): void {
        this.dialog
            .open(UserComponent, {
                enterAnimationDuration: "1000ms",
                exitAnimationDuration: "500ms",
                panelClass: "my-outlined-dialog",
                data: {
                    action: "add",
                    title: "Add user",
                    position: 0,
                    user: {email: "", firstName: "", lastName: "", password: ""} },
            })
            .afterClosed()
            .subscribe(result => {
                console.log("Add dialog result: ", result);
                this.ngOnInit();
            });
    }
}
