import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });
  showPw = false;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
  ) {
    if (this.auth.isAdmin()) this.router.navigate(['/products']);
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';
    const { username, password } = this.form.value;
    this.auth.login(username!, password!).subscribe({
      next: () => this.router.navigate(['/products']),
      error: (e) => {
        this.error = e.error?.message || 'Login failed';
        this.loading = false;
      },
    });
  }
}
