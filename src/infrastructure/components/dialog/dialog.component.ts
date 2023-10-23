import { Component, ElementRef, Inject, Input, OnInit, Renderer2, ViewChild } from "@angular/core";
import { NgFor, NgIf } from "@angular/common";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
//import { SignupComponent } from "../signup/signup.component";
import { IUser } from "../../../domain/model/IUser";
//import { UsersService } from "src/services/users.service";
import { checkPasswordValidator } from "../../../utils/CustomValidators";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import * as bcrypt from "bcryptjs";
import { UsersRepoService } from "src/infrastructure/repositories/users-repo.service";

// interface Role {
//   value: string;
//   viewValue: string;
// }

@Component({
    selector: "dialog2",
    standalone: true,
    imports: [
        // NgFor,
        NgIf,
        // ReactiveFormsModule,
        MatDialogModule,
        MatIconModule,
        // MatButtonModule,
        // MatSelectModule,
        // MatInputModule,
        // MatFormFieldModule,
    ],
    templateUrl: "./dialog.component.html",
    styleUrls: ["./dialog.component.scss"],
})
export class DialogComponent { // implements OnInit {
    // protected userForm: FormGroup = this.formBuilder.group({});
    // private _user!: IUser;
    // @Input()
    // set user(value: IUser) {
    //     this._user = value;
    // }
    // get user(): IUser {
    //     return this._user;
    // }
    // protected pwdState = {
    //     type: ["password", "text"],
    //     svg: ["eye-slash", "eye"],
    //     alt: [
    //         "The password text is not visible",
    //         "The password text is visible",
    //     ],
    //     state: 0,
    // };
    // @ViewChild("confirmation", { static: true }) confirmationRef:
    //     | ElementRef
    //     | undefined;
    // @ViewChild("error", { static: true }) errorRef: ElementRef | undefined;
    // protected roles: Role[] = [
    //     { value: "admin", viewValue: "Admin" },
    //     { value: "section", viewValue: "Section head" },
    //     { value: "default", viewValue: "default" },
    // ];

    constructor(
        //public activeModal: NgbActiveModal,
        //private formBuilder: FormBuilder,
        // private modalService: NgbModal,
        // private usersService: UsersService
        // private ren: Renderer2,
        //private repo: UsersRepoService,
        // private dialogRef: MatDialogRef<DialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {title: string, text: string, no: boolean}
    ) {}

    // ngOnInit(): void {
        // const formGroup = {
        //     _id: new FormControl(""),
        //     updatedAt: new FormControl(""),
        //     email: new FormControl("", {
        //         validators: [Validators.required, Validators.email],
        //     }),
        //     firstName: new FormControl("", {
        //         validators: [Validators.required],
        //     }),
        //     lastName: new FormControl("", {
        //         validators: [Validators.required],
        //     }),
        //     password: new FormControl("", {
        //         validators: [
        //             Validators.required,
        //             Validators.minLength(8),
        //             checkPasswordValidator(),
        //         ],
        //     }),
        //     role: new FormControl("", {
        //         validators: [Validators.required],
        //     }),
        // };
        // this.data.user.updatedAt = this.data.user.updatedAt ?? "";
        // console.log("DDD", this.data);
        // this.userForm = this.formBuilder.group(formGroup);
        // this.userForm.setValue(this.data.user);
        // if (this.user.email != null)
        //     this.userForm.get('email')!.setValue(this.user.email);
        // if (this.user.firstName != null)
        //     this.userForm.get("firstName")!.setValue(this.user.firstName);
        // if (this.user.lastName != null)
        //     this.userForm.get("lastName")!.setValue(this.user.lastName);
        // if (this.user.password != null)
        //     this.userForm.get('password')!.setValue(this.user.password);
        // if (this.user.role != null)
        //     this.userForm.get("role")!.setValue(this.user.role);
        // const el = document
        //     .getElementsByClassName("cdk-global-overlay-wrapper")
        //     .item(0);
        // this.ren.setStyle(el, "overflow-y", "auto");
    // }

    // protected getError = (field: string) => {
    //     const errors = this.userForm.get(field)?.errors ?? {};

    //     if (Object.keys(errors).length === 0) return null;
    //     const subject =
    //         field === "email"
    //             ? "The email"
    //             : field === "firstName"
    //             ? "The first name"
    //             : field === "lastName"
    //             ? "The last name"
    //             : field === "password"
    //             ? "The password"
    //             : "The role";

    //     if (errors["required"]) return subject + " is mandatory.";
    //     if (errors['minlength'])
    //         return (
    //             subject +
    //             ` must be at lest ${errors['minlength'].requiredLength} characters.`
    //         );

    //     if (errors["checkPassword"])
    //         return (
    //             subject +
    //             " must have at least one lowercase letter, one uppercase letter, one digit, and one special character."
    //         );
    //     return subject + " is not valid.";
    // };

    // save() {
    //     const newVal: IUser = this.userForm.value;

    //     if (newVal.password != this.data.user.password)
    //         newVal.password = bcrypt.hashSync(newVal.password, 12);

    //     newVal.email = newVal.email.toLowerCase();

    //     this.repo.getUsers({email: newVal.email}).subscribe(resp => {
    //         if (resp.data.length > 0)
    //             console.log("RESP", resp)
    //     });

        // this.repo.putUser(newVal).subscribe(resp => {
        //     console.log("SAVE", resp);
        //     if (resp.status == 200)
        //         this.dialogRef.close(resp);
        // })

        //this.activeModal.close();
        // const email = this.loginForm.get('email')?.value;
        // const password = this.loginForm.get('password')?.value;

        // this.usersService.login(email, password).then((res) => {
        //     if (res == 'signup') {
        //         this.signUpConfirmation();
        //         return;
        //     } else if (!res){
        //         this.showError()
        //     }
        //     this.activeModal.close();
        // });
    // }

    // signUpConfirmation(){
    //     this.modalService.open(this.confirmationRef).result.then(
    //         (result) => {
    //             if (result == 'signup') {
    //                 this.signUp();
    //             }
    //         },
    //         (reason) => {
    //             console.log(reason);
    //         }
    //     );
    // }

    // signUp() {
    //     const modalRef = this.modalService.open(SignupComponent, {
    //         fullscreen: true,
    //         windowClass: 'login-modal',
    //     });
    //     this.user.email = this.loginForm.get('email')?.value;
    //     this.user.password = this.loginForm.get('password')?.value;
    //     modalRef.componentInstance.user = this.user;
    //     this.activeModal.close();
    // }

    // showError() {
    //     this.modalService.open(this.errorRef).result.then(
    //         (result) => {
    //             console.log(result);
    //         },
    //         (reason) => {
    //             console.log(reason);
    //         }
    //     );
    // }

    // togglePwdState() {
    //     this.pwdState.state = 1 - this.pwdState.state;
    // }

    // getCtrl = (name: string) => this.userForm.get(name) as FormControl;
    // isSet = (name: string) => this.userForm.get(name)?.value != "";
    // set = (name: string, val: unknown) =>
    //     this.userForm.get(name)?.setValue(val);
    // get = (name: string) => this.userForm.get(name)?.value;
    // areChanges = () => {
    //     const a = this.userForm.value;
    //     const b = this.data.user;
    //     return Object.keys(a).some(key => a[key] !== b[key as keyof IUser])
    // };
}
