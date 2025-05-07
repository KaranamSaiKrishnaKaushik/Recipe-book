import { Injectable} from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, from, Subject, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from './user.model';
import { ProviderUserInfo } from './provider-user-info.model';
import {
  getAuth,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';

 export interface AuthResponseData {
   idToken: string;
   email: string;
   refreshToken: string;
   expiresIn: string;
   localId: string;
   registered?: boolean;
   passwordHash?: string;
   providerUserInfo?: ProviderUserInfo[];
 }

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User | null>(null);
  private tokenExpirationTimer: any;
  currentUser: any;
  constructor(private http: HttpClient, private router: Router) {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      this.currentUser = user;
      console.log('Auth user is:', user);
    });
  }

  setAuthToken(token: string) {
    localStorage.setItem('authToken', token);
  }

  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  signUp(email: string, password: string) {
    const auth = getAuth();
    return from(createUserWithEmailAndPassword(auth, email, password)).pipe(
      catchError(this.handleError),
      tap((userCredential) => {
        const user = userCredential.user;
        user.getIdToken().then((token) => {
          this.handleAuthentication(user.email!, user.uid, token, 3600);
        });
      })
    );
  }

  login(email: string, password: string) {
    const auth = getAuth();
    return from(signInWithEmailAndPassword(auth, email, password)).pipe(
      catchError(this.handleError),
      tap((userCredential) => {
        const user = userCredential.user;
        user.getIdToken().then((token) => {
          this.handleAuthentication(user.email!, user.uid, token, 3600); // 1 hour expiry
        });
      })
    );
  }

  onChangePasswordSubmit(
    email: string,
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const auth = getAuth();
      const user = this.currentUser;

      if (user && email) {
        const credential = EmailAuthProvider.credential(email, currentPassword);
        reauthenticateWithCredential(user, credential)
          .then(() => updatePassword(user, newPassword))
          .then(() => {
            resolve(true);
          })
          .catch((error) => {
            console.error('Password change failed:', error.message);
            resolve(false);
          });
      } else {
        console.error('No user is currently logged in.');
        resolve(false);
      }
    });
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    localStorage.removeItem('authToken');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);
    this.autoLogout(+expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
    this.setAuthToken(token);
    console.log('local storage : ', localStorage.getItem('authToken'));
  }

  autoLogin() {
    const userDataString = localStorage.getItem('userData');
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = userDataString ? JSON.parse(userDataString) : null;
    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS': {
        errorMessage =
          'The email address is already in use by another account.';
        break;
      }
      case 'OPERATION_NOT_ALLOWED':
        errorMessage = 'Password sign-in is disabled for this project';
        break;
      case 'TOO_MANY_ATTEMPTS_TRY_LATER':
        errorMessage =
          'We have blocked all requests from this device due to unusual activity. Try again later.';
        break;
      case 'EMAIL_NOT_FOUND': {
        errorMessage =
          'There is no user record corresponding to this identifier. The user may have been deleted.';
        break;
      }
      case 'INVALID_LOGIN_CREDENTIALS': {
        errorMessage =
          ' The password is invalid or the user does not have a password.';
        break;
      }
      case 'USER_DISABLED': {
        errorMessage =
          'The user account has been disabled by an administrator.';
        break;
      }
    }
    return throwError(errorMessage);
  }
}
