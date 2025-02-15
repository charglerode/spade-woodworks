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

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent {
  contactForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.contactForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          // Must be at least 2 characters; allows letters (upper/lower), hyphens, and apostrophes
          Validators.pattern(/^[A-Za-z\s'-]{2,}$/),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      reason: ['', [Validators.required, Validators.minLength(1)]],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  /**
   * Basic sanitization that removes any HTML or script tags.
   * In production, consider using a robust library (e.g. DOMPurify) or server-side sanitization.
   */
  sanitizeInput(input: string): string {
    return input
      .replace(/<script.*?>.*?<\/script>/gi, '')
      .replace(/<.*?>/g, '');
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      const rawData = this.contactForm.value;
      const sanitizedData = {
        name: this.sanitizeInput(rawData.name),
        email: this.sanitizeInput(rawData.email),
        message: this.sanitizeInput(rawData.message),
      };
      console.log('Sanitized contact form submission', sanitizedData);
      alert('Thank you for contacting us!');
      // this.contactForm.reset();
      this.router.navigate(['']);
    }
  }
}
