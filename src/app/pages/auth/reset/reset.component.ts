import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-reset',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './reset.component.html',
  styleUrl: './reset.component.scss',
})
export class ResetComponent implements OnInit {
  resetForm: FormGroup;
  id = '';
  error = '';
  message = '';

  constructor(
    private fb: FormBuilder,
    private service: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirm: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          this.passwordMatchValidator(),
        ],
      ],
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')!;
  }

  onSubmit(): void {
    if (this.resetForm.valid) {
      const body = { password: this.resetForm.get('password')?.value };
      this.service.resetPassword(this.id, body).subscribe({
        next: (res) => {
          if (res.status === 'success') {
            this.message =
              'Your password has successfully been changed. You will be redirected in 3 seconds...';
            const timeout = setTimeout(() => {
              clearTimeout(timeout);
              this.router.navigate(['/inventory']);
            }, 3000);
          }
        },
        error: (err) => {
          this.error = 'An unknown error occurred. Please try again later.';
        },
      });
    }
  }

  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('password')?.value;
      const confirm = control.get('confirm')?.value;
      if (password && confirm && password !== confirm) {
        return { passwordMismatch: true };
      }
      return null;
    };
  }
}
