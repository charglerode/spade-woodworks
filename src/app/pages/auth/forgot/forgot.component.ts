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
  selector: 'app-forgot',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './forgot.component.html',
  styleUrl: './forgot.component.scss',
})
export class ForgotComponent {
  forgotForm: FormGroup;
  error = '';
  message = '';

  constructor(
    private fb: FormBuilder,
    private service: AuthService,
    private router: Router,
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.forgotForm.valid) {
      this.service.forgotPassword(this.forgotForm.value).subscribe({
        next: (res) => {
          if (res.status === 'success') {
            this.message =
              'A link to reset your password has been to sent to the email provided.';
            const timeout = setTimeout(() => {
              clearTimeout(timeout);
              this.router.navigate(['/login']);
            }, 3000);
          }
        },
        error: (err) => {
          if (err.status === 404) {
            this.error = 'There is no user with that email address.';
          } else {
            this.error = 'An unknown error occurred. Please try again later.';
          }
        },
      });
    }
  }
}
