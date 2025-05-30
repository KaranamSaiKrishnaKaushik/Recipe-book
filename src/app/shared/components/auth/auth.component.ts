import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  NgForm,
  Validators,
} from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { UserSettings } from '../../models/user-settings.model';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  @ViewChild('authForm') aForm: NgForm;
  isLoginMode = true;
  isLoading = false;
  error: string;
  authForm: FormGroup;

  constructor(
    private authService: AuthService,
    private auth0: Auth0Service,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.auth0.isAuthenticated$.subscribe((isAuth) => {
      if (isAuth) {
        this.router.navigate(['/overview']);
      } else {
        this.authService.login();
      }
    });
  }

  onLoginWithPopup() {
    this.authService.loginWithPopup();
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) return;

    this.isLoading = true;
    (document.activeElement as HTMLElement)?.blur();

    if (this.isLoginMode) {
      this.authService.login();
    } else {
      const { email, password, confirmPassword, firstName, lastName } =
        form.value;

      if (password !== confirmPassword) {
        this.error = 'Passwords do not match!';
        this.isLoading = false;
        return;
      }

      const userSettings = new UserSettings();
      userSettings.userFirstName = firstName;
      userSettings.userLastName = lastName;

      this.authService.signUp(email, password, userSettings);
    }
  }

  passwordsMatchValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const form = control as FormGroup;
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    return password && confirmPassword && password !== confirmPassword
      ? { mismatch: true }
      : null;
  }
}
