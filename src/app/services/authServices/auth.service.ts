import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:9090/api/auth';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  login(email: string, password: string): Observable<any> {
    const payload = { email, password };
    console.log('Sending login request to:', `${this.apiUrl}/login`);
    console.log('Login payload:', payload);
    
    return this.http.post(`${this.apiUrl}/login`, payload, this.httpOptions).pipe(
      tap((response: any) => {
        console.log('Login response:', response);
        if (isPlatformBrowser(this.platformId)) {
          const user = response?.user || response;
          if (user?.email) {
            localStorage.setItem('user', JSON.stringify(user));
            console.log('User saved to localStorage:', user);
          }
        }
      }),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => error);
      })
    );
  }

  register(user: any): Observable<any> {
    console.log('Sending register request to:', `${this.apiUrl}/register`);
    console.log('Register payload:', user);
    
    return this.http.post(`${this.apiUrl}/register`, user, this.httpOptions).pipe(
      tap((response: any) => {
        console.log('Register response:', response);
        if (isPlatformBrowser(this.platformId)) {
          const userData = response?.user || response;
          if (userData?.email) {
            localStorage.setItem('user', JSON.stringify(userData));
            console.log('User saved to localStorage:', userData);
          }
        }
      }),
      catchError(error => {
        console.error('Register error:', error);
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('user');
      console.log('User removed from localStorage');
    }
  }

  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const user = localStorage.getItem('user');
      return !!user;
    }
    return false;
  }

  getUser(): any {
    if (isPlatformBrowser(this.platformId)) {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }
}