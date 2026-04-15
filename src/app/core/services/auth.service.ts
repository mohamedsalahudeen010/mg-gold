import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = `${environment.apiUrl}/auth`;
  isAdmin = signal<boolean>(false);
  adminName = signal<string>('');

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    const token = localStorage.getItem('admin_token');
    const name = localStorage.getItem('admin_name');
    if (token) {
      this.isAdmin.set(true);
      this.adminName.set(name ?? '');
    }
  }

  login(username: string, password: string) {
    return this.http
      .post<{
        token: string;
        username: string;
      }>(`${this.api}/login`, { username, password })
      .pipe(
        tap((res) => {
          localStorage.setItem('admin_token', res.token);
          localStorage.setItem('admin_name', res.username);
          this.isAdmin.set(true);
          this.adminName.set(res.username);
        }),
      );
  }

  logout() {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_name');
    this.isAdmin.set(false);
    this.adminName.set('');
    this.router.navigate(['/products']);
  }

  getToken() {
    return localStorage.getItem('admin_token');
  }
}
