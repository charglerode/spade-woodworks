import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup;
  error = '';

  constructor(
    private fb: FormBuilder,
    private service: AuthService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.service.login(this.loginForm.value).subscribe({
        next: (res) => {
          if (res.status === 'success') {
            localStorage.setItem('jwt', res.token);
            this.router.navigate(['/inventory']);
          }
        },
        error: (err) => {
          if (err.status === 401) {
            this.error =
              'Authentication failed. Email or password is incorrect.';
          } else {
            this.error = 'An unknown error occurred. Please try again later.';
          }
        },
      });
    }
  }
}
