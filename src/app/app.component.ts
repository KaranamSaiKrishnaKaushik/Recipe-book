import { Component } from '@angular/core';
import { AuthService } from './shared/components/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'RecipeBook';
  constructor(private authService: AuthService){}

  ngOnInit(): void {
    this.authService.autoLogin();
  }
}
