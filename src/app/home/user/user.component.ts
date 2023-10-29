import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { NgFor, NgIf } from "@angular/common";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { IUser } from "../../../domain/model/IUser";
import { checkPasswordValidator } from "../../../utils/CustomValidators";
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import * as bcrypt from "bcryptjs";
import { UsersRepoService } from "src/infrastructure/repositories/users-repo.service";
import { Dialog2Component } from "src/infrastructure/components/dialog2/dialog2.component";
import { ROLES } from "src/domain/model/IUser";

@Component({
    selector: "user",
    standalone: true,
    imports: [
        NgFor,
        NgIf,
        ReactiveFormsModule,
        MatDialogModule,
        MatIconModule,
        MatButtonModule,
        MatSelectModule,
        MatInputModule,
        MatFormFieldModule,
    ],
    templateUrl: "./user.component.html",
    styleUrls: ["./user.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class UserComponent implements OnInit {
    protected userForm: FormGroup = this.formBuilder.group({});
    protected pwdState = {
        type: ["password", "text"],
        svg: ["eye-slash", "eye"],
        alt: [
            "The password text is not visible",
            "The password text is visible",
        ],
        state: 0,
    };
    protected formDisabled = false;
    protected roles = ROLES;

    constructor(
        private formBuilder: FormBuilder,
        private repo: UsersRepoService,
        private dialogRef: MatDialogRef<UserComponent>,
        private dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            position: number;
            user: IUser;
            action: string;
        }
    ) {}

    ngOnInit(): void {
        const formGroup = {
            _id: new FormControl(""),
            updatedAt: new FormControl(""),
            createdAt: new FormControl(""),
            __v: new FormControl(""),
            email: new FormControl("", {
                validators: [Validators.required, Validators.email],
            }),
            firstName: new FormControl("", {
                validators: [Validators.required],
            }),
            lastName: new FormControl("", {
                validators: [Validators.required],
            }),
            password: new FormControl("", {
                validators: [
                    Validators.required,
                    Validators.minLength(8),
                    checkPasswordValidator(),
                ],
            }),
            role: new FormControl("", {
                validators: [Validators.required],
            }),
        };
        this.data.user._id = this.data.user._id ?? "";
        this.data.user.createdAt = this.data.user.createdAt ?? "";
        this.data.user.updatedAt = this.data.user.updatedAt ?? "";
        this.data.user.role = this.data.user.role ?? "default";
        this.data.user.__v = this.data.user.__v ?? "";
        this.userForm = this.formBuilder.group(formGroup);
        this.userForm.setValue(this.data.user);
        if (this.data.action == "Delete") {
            this.formDisabled = true;
        }
    }

    protected getError = (field: string) => {
        const errors = this.userForm.get(field)?.errors ?? {};

        if (Object.keys(errors).length === 0) return null;
        const subject =
            field === "email"
                ? "The email"
                : field === "firstName"
                ? "The first name"
                : field === "lastName"
                ? "The last name"
                : field === "password"
                ? "The password"
                : "The role";

        if (errors["required"]) return subject + " is mandatory.";
        if (errors["minlength"])
            return (
                subject +
                ` must be at lest ${errors["minlength"].requiredLength} characters.`
            );

        if (errors["checkPassword"])
            return (
                subject +
                " must have at least one lowercase letter, one uppercase letter, one digit, and one special character."
            );
        return subject + " is not valid.";
    };

    protected save() {
        const newVal: IUser = this.userForm.value;

        if (this.data.action == "Delete") {
            this.delete(newVal._id!);
            return;
        }

        if (newVal.password != this.data.user.password)
            newVal.password = bcrypt.hashSync(newVal.password, 12);

        newVal.email = newVal.email.toLowerCase();

        if (this.data.action == "Add") this.emailExists(newVal, this.add);

        if (this.data.action == "Edit") this.emailExists(newVal, this.edit);

    }

    protected delete(id: string) {
        this.repo.deleteUser(id).subscribe(resp => {
            if (resp.status == 200) this.dialogRef.close(resp);
            else {
                this.dialog.open(Dialog2Component, {
                    data: {
                        title: "Error",
                        text: `The user can not be deleted.\n${resp.message}`,
                        yes: "OK",
                    },
                });
            }
        });
    }

    private emailExists = (
        newVal: IUser,
        callback: (newVal: IUser) => void
    ) => {
        this.repo.getUsers({ email: newVal.email }).subscribe(resp => {
            if (resp.data.length > 0 && resp.data[0]._id !== newVal._id) {
                this.dialog.open(Dialog2Component, {
                    data: {
                        title: "Alert",
                        text: "A user with the same email has already been registered",
                        yes: "OK",
                    },
                });
            } else {
                callback(newVal);
            }
        });
    };

    private edit = (newVal: IUser) => {
        this.repo.putUser(newVal).subscribe(resp => {
            if (resp.status == 200) this.dialogRef.close(resp);
            else {
                this.dialog.open(Dialog2Component, {
                    data: {
                        title: "Error",
                        text: `The user can not be updated.\n${resp.message}`,
                        yes: "OK",
                    },
                });
            }
        });
    };

    private add = (newVal: IUser) => {
        delete newVal._id;
        this.repo.addUser(newVal).subscribe(resp => {
            if (resp.status == 200) this.dialogRef.close(resp);
            else {
                this.dialog.open(Dialog2Component, {
                    data: {
                        title: "Error",
                        text: `The user can not be added.\n${resp.message}`,
                        yes: "OK",
                    },
                });
            }
        });
    };

    togglePwdState() {
        this.pwdState.state = 1 - this.pwdState.state;
    }

    getCtrl = (name: string) => this.userForm.get(name) as FormControl;
    isSet = (name: string) => this.userForm.get(name)?.value != "";
    set = (name: string, val: unknown) =>
        this.userForm.get(name)?.setValue(val);
    get = (name: string) => this.userForm.get(name)?.value;
    areChanges = () => {
        const a = this.userForm.value;
        const b = this.data.user;
        return Object.keys(a).some(key => a[key] !== b[key as keyof IUser]);
    };
}
