import { Component } from '@angular/core';
import { AuthService } from './shared/components/auth/auth.service';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'RecipeBook';
  constructor(
    private authService: AuthService,
    private auth0: Auth0Service, 
    private router: Router
  ){
      this.auth0.handleRedirectCallback().subscribe({
    next: () => {
      this.auth0.isAuthenticated$.subscribe((isAuth) => {
        if (isAuth) this.router.navigate(['/overview']);
      });
    },
    error: err => console.error('Redirect error:', err)
  });
  }

  ngOnInit(): void {
    this.authService.autoLogin();
  }
}
