import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
    registerForm: FormGroup = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      phoneNumber: new FormControl('', [Validators.required, Validators.max(12)])
    }) 

    validInputs: boolean = true;
    errorMessage: string = "All fields are required. plese fill them correctly.";

    onSubmit() {
      if (!this.registerForm.valid) {
        console.log(this.registerForm.value);
        this.validInputs = false;
        return;
        
      }
    }
}
