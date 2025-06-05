import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { User } from './user.model';
import { UserSettings } from '../../models/user-settings.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User | null>(null);
  private tokenExpirationTimer: any;
  constructor(
    private auth0: Auth0Service,
    private router: Router
  ) {
    this.auth0.user$.subscribe((auth0User) => {
      if (auth0User) {
        const exp = auth0User['exp'] || Math.floor(Date.now() / 1000) + 3600;
        const expirationDate = new Date(exp * 1000); 
        const email = auth0User.email;
        const sub = auth0User.sub; 
        const user = new User(email ?? 'unknown@example.com', sub!, '', expirationDate);
        const isGoogle = sub?.startsWith('google-oauth2');
        console.log('Email:', email);
        console.log('Is Google user:', isGoogle);
        localStorage.setItem('userEmail', JSON.stringify(email));
        localStorage.setItem('isSocialMediaAccount', JSON.stringify(isGoogle));
        this.user.next(user);
        this.autoLogout(expirationDate.getTime() - Date.now());
      }
    });
  }

 async getToken(): Promise<string> {
    return await firstValueFrom(this.auth0.getAccessTokenSilently());
  }

  setAuthToken(token: string) {
    localStorage.setItem('authToken', token);
  }

  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  signUp(email: string, password: string, userSettings: UserSettings): void {
    //this.login();
    this.auth0.loginWithRedirect({
    authorizationParams: {
      screen_hint: 'signup' 
    }
  });
  }

  login(): void {
    this.auth0.loginWithRedirect({
    authorizationParams: {
      screen_hint: 'login' 
    }
  });
  }

  changePassword(email: string): void {
  const domain = environment.auth.domain;
  const clientId = environment.auth.clientId;

  const url = `https://${domain}/dbconnections/change_password`;

  const data = {
    client_id: clientId,
    email: email,
    connection: 'Username-Password-Authentication'
  };

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(async res => {
      const text = await res.text();
      console.log('Password reset result:', text);
      alert(text);
    })
    .catch(err => {
      alert('Error sending password reset email.');
      console.error(err);
    });
}

  onChangePasswordSubmit(): Promise<boolean> {
    console.warn('Password change is handled by Auth0.');
    alert('To change your password, please use the "Forgot password" link on the login page.');
    return Promise.resolve(false);
  }



  logout(): void {
    this.user.next(null);
    localStorage.removeItem('userData');
    localStorage.removeItem('authToken');
    if (this.tokenExpirationTimer) clearTimeout(this.tokenExpirationTimer);
    this.tokenExpirationTimer = null;

    this.auth0.logout({ logoutParams: { returnTo: window.location.origin } });
  }

  autoLogout(expirationDuration: number): void {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  autoLogin(): void {
    this.auth0.isAuthenticated$.subscribe((isAuth) => {
      if (isAuth) {
        this.auth0.user$.subscribe((auth0User) => {
          if (auth0User) {
            const exp = auth0User['exp'] || Math.floor(Date.now() / 1000) + 3600;
            const expirationDate = new Date(exp * 1000);
            const user = new User(auth0User.email ?? 'unknown@example.com', auth0User.sub!, '', expirationDate);
            this.user.next(user);
            this.autoLogout(expirationDate.getTime() - Date.now());
          }
        });
      }
    });
  }

  private handleError(error: any): never {
    let errorMessage = 'An unknown error occurred!';
    if (error.error?.message) errorMessage = error.error.message;
    throw new Error(errorMessage);
  }

loginWithPopup(): void {
  this.auth0.loginWithPopup().subscribe({
    next: () => {
      this.auth0.user$.subscribe(user => {
        console.log('User:', user);
        this.router.navigate(['/overview']);
      });
    },
    error: err => console.error(err)
  });
}

}
