import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  constructor(private registerUser: UserService, private router: Router) {}
  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  errorMessage: string = 'All fields are required.';

  onSubmit() {
    if (!this.loginForm.valid) {
      return;
    }
    this.registerUser.authenticateUser(this.loginForm.value).subscribe(
      (res) => {
        if (res.status === 200) {
          this.registerUser.getUserInfo().subscribe((userData) => {
            this.registerUser.setUser(userData as User);
            this.router.navigate(['/']);
          }, err => {
            console.log(err.message);
          })
        }
      },
      (err) => {
        switch (err.status) {
          case 401: {
            this.errorMessage = 'Invalid email or password';
            break;
          }
          case 403: {
            this.errorMessage = 'Ensure that your account is verified.';
            break;
          }
          default: {
            this.errorMessage = "Error occurred. please try again later";
          }
        }
      }
    );
  }
}
