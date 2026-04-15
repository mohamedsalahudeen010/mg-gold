import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="login-page">
      <div class="login-card">
        <div class="login-left">
          <div class="brand">
            <span class="crown">♛</span>
            <h2>GoldMart Admin</h2>
            <p>Sign in to manage your gold shop inventory</p>
          </div>
        </div>
        <div class="login-right">
          <h3>Admin Login</h3>
          <form [formGroup]="form" (ngSubmit)="submit()">
            <div class="field">
              <label>Username</label>
              <input
                formControlName="username"
                placeholder="Enter username"
                autocomplete="username"
              />
            </div>
            <div class="field">
              <label>Password</label>
              <div class="pw-wrap">
                <input
                  [type]="showPw ? 'text' : 'password'"
                  formControlName="password"
                  placeholder="Enter password"
                  autocomplete="current-password"
                />
                <button type="button" class="eye" (click)="showPw = !showPw">
                  {{ showPw ? '🙈' : '👁️' }}
                </button>
              </div>
            </div>
            <p class="error" *ngIf="error">{{ error }}</p>
            <button
              type="submit"
              class="login-btn"
              [disabled]="form.invalid || loading"
            >
              {{ loading ? 'Signing in...' : 'Sign In' }}
            </button>
          </form>
          <a routerLink="/products" class="back-link">← Back to Shop</a>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      * {
        box-sizing: border-box;
      }
      .login-page {
        min-height: 100vh;
        background: #f1f3f6;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
      }
      .login-card {
        display: flex;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
        width: 100%;
        max-width: 820px;
      }
      .login-left {
        background: linear-gradient(135deg, #b8860b, #daa520, #ffd700);
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 48px 32px;
      }
      .brand {
        text-align: center;
        color: #3d2b00;
      }
      .crown {
        font-size: 56px;
        display: block;
        margin-bottom: 12px;
      }
      .brand h2 {
        font-size: 26px;
        font-weight: 700;
        margin-bottom: 8px;
      }
      .brand p {
        font-size: 14px;
        opacity: 0.8;
        line-height: 1.5;
      }
      .login-right {
        background: #fff;
        flex: 1;
        padding: 48px 40px;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      .login-right h3 {
        font-size: 22px;
        font-weight: 600;
        color: #212121;
        margin-bottom: 28px;
      }
      .field {
        margin-bottom: 20px;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      label {
        font-size: 13px;
        font-weight: 500;
        color: #212121;
      }
      input {
        border: 1px solid #d0d0d0;
        border-radius: 4px;
        padding: 12px 14px;
        font-size: 14px;
        outline: none;
        transition: border-color 0.2s;
        width: 100%;
      }
      input:focus {
        border-color: #b8860b;
      }
      .pw-wrap {
        position: relative;
      }
      .pw-wrap input {
        padding-right: 44px;
      }
      .eye {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        cursor: pointer;
        font-size: 16px;
      }
      .error {
        color: #d32f2f;
        font-size: 13px;
        margin-bottom: 12px;
      }
      .login-btn {
        width: 100%;
        background: #b8860b;
        color: #fff;
        border: none;
        padding: 13px;
        border-radius: 4px;
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s;
      }
      .login-btn:hover {
        background: #9a7009;
      }
      .login-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
      .back-link {
        display: block;
        text-align: center;
        margin-top: 20px;
        font-size: 13px;
        color: #878787;
        text-decoration: none;
      }
      .back-link:hover {
        color: #b8860b;
      }

      /* ── Responsive ── */
      @media (max-width: 767px) {
        .login-left {
          display: none;
        }
        .login-right {
          padding: 36px 24px;
        }
        .login-card {
          max-width: 440px;
        }
      }
      @media (max-width: 479px) {
        .login-right {
          padding: 28px 16px;
        }
        .login-right h3 {
          font-size: 20px;
          margin-bottom: 20px;
        }
      }
    `,
  ],
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
