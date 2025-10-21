import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
    constructor(private registerService: UserService, private snackBar: MatSnackBar) {
      this.registerService = registerService;
    } 
    registerForm: FormGroup = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      phoneNumber: new FormControl('', [Validators.required, Validators.min(12), Validators.max(12)])
    }) 

    validInputs: boolean = true;
    errorMessage: string = "All fields are required. plese fill them correctly.";

    onSubmit() {
      if (!this.registerForm.valid) {
        this.validInputs = false;
        return;
        
      }
      else {
        const res = this.registerService.signUser(this.registerForm.value).subscribe( res => {
          res.status === 201 ? this.snackBar.open("Registered Successfully", "Close", {duration: 3000})
          : this.snackBar.open("Registration Failed", "Close", {duration: 3000});
        }, err => {
          switch (err.status) {
            case 409: {
              this.snackBar.open("User already exists", "Close", {duration: 3000, panelClass: ['custom-snackbar']});
              break;
            }
            case 400:
              this.snackBar.open("Invalid data. Please check your input.", "Close", { duration: 3000 });
              break;
          }
        });
      }
    }
}
