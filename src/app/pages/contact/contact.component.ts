// src/app/contact-page/contact-page.component.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent {
  contactForm: FormGroup;
  message = '';
  error = '';

  constructor(
    private service: ContactService,
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.contactForm = this.fb.group({
      name: [
        '',
        [Validators.required, Validators.pattern(/^[A-Za-z\s'-]{2,}$/)],
      ],
      email: ['', [Validators.required, Validators.email]],
      reason: ['', [Validators.required, Validators.minLength(1)]],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.service.sendMessage(this.contactForm.value).subscribe({
        next: (res) => {
          if (res.status === 'success') {
            this.message =
              'Thank you for reaching out! We will address your inquiry and get back to as soon as possible.';
            const timeout = setTimeout(() => {
              clearTimeout(timeout);
              this.router.navigate(['/']);
            }, 5000);
          }
        },
        error: (err) => {
          this.error = 'An unknown error occurred. Please try again later.';
        },
      });
    }
  }
}
