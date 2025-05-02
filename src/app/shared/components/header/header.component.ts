import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  private userSub: Subscription;
  isAuthenticated = false;
  
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(user=>{
      this.isAuthenticated = !!user;
      console.log('user: ',user);
      console.log('!user: ',!user);
      console.log('!!user: ',!!user);
    });
  }

  onLogout(){
    this.authService.logout();
  }

  onFetchData(){
    
  }
}
