import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { AuthService } from '../services/authServices/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
declare var bootstrap: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  loginData = { email: '', password: '' };
  registerData = { name: '', email: '', password: '', confirmPassword: '' };
  errorMessage: string = '';
  isLoggedIn: boolean = false;
  user: any = null;

  constructor(
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.checkLoginStatus();
    }
  }

  checkLoginStatus(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.user = this.authService.getUser();
      console.log('User is logged in:', this.user);
    } else {
      console.log('User is not logged in');
    }
  }

  onLoginSubmit(event?: Event): void {
    // Prevent default form submission
    if (event) event.preventDefault();
    
    console.log('Login attempt with:', this.loginData);
    this.errorMessage = '';
    
    this.authService.login(this.loginData.email, this.loginData.password).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.isLoggedIn = true;
        this.user = response;
        this.loginData = { email: '', password: '' };
        this.closeModal('loginModal');


        // Force UI update
        setTimeout(() => {
          this.checkLoginStatus();
        }, 100);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Login error:', error);
        if (error.status === 401) {
          this.errorMessage = 'Invalid email or password. Please try again.';
        } else {
          this.errorMessage = 'An error occurred. Please try again later.';
        }
      }
    });
  }

  onRegisterSubmit(event?: Event): void {
    // Prevent default form submission
    if (event) event.preventDefault();
    
    console.log('Register attempt with:', this.registerData);
    this.errorMessage = '';
    
    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    const user = {
      name: this.registerData.name,
      email: this.registerData.email,
      password: this.registerData.password,
      role: 'CLIENT',
      imagePath: null
    };

    this.authService.register(user).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        this.isLoggedIn = true;
        this.user = response;
        this.registerData = { name: '', email: '', password: '', confirmPassword: '' };
        this.closeModal('registerModal');
        // Force UI update
        setTimeout(() => {
          this.checkLoginStatus();
        }, 100);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Registration error:', error);
        if (error.status === 400 && error.error === 'Email already exists') {
          this.errorMessage = 'Email already exists. Please use a different email.';
        } else {
          this.errorMessage = 'An error occurred during registration. Please try again.';
        }
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.user = null;
    this.errorMessage = '';
    console.log('User logged out');
  }

  closeModal(modalId: string): void {
    if (isPlatformBrowser(this.platformId)) {
      const modalElement = document.getElementById(modalId);
      if (modalElement) {
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
          modal.hide();
        }
      }
    }
    this.errorMessage = '';
  }

  resetLoginForm(): void {
    this.loginData = { email: '', password: '' };
    this.errorMessage = '';
    this.closeModal('loginModal');
  }

  resetRegisterForm(): void {
    this.registerData = { name: '', email: '', password: '', confirmPassword: '' };
    this.errorMessage = '';
    this.closeModal('registerModal');
  }
}