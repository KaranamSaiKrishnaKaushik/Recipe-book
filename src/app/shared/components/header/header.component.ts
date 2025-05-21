import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../product-list/product.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  private userSub: Subscription;
  isAuthenticated = false;
  cartItems: Product[]=[];
  cartItemCount : number=0;
  
  constructor(private authService: AuthService, private cartService: CartService) { }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(user=>{
      this.isAuthenticated = !!user;
      console.log('user: ',user);
      console.log('!user: ',!user);
      console.log('!!user: ',!!user);
    });

    this.cartService.loadCartFromApi();
    this.cartService.cart$.subscribe((cartItems) => {
      this.cartItems = cartItems;
      this.cartItemCount  = this.cartItems.length;
    });
  }

  onLogout(){
    this.authService.logout();
  }

  onFetchData(){
    
  }
}
