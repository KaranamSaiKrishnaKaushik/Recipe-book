import { Component, OnInit } from '@angular/core';
import { Product } from '../product-list/product.model';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { CheckoutService } from '../../services/checkout.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css'],
})
export class ShoppingCartComponent implements OnInit {
  cartItems: Product[] = [];
  productsPrice: number;
  pfandPrice: number;
  orderHistoryList: any;
  status: 'delivered';

  constructor(
    private cartService: CartService,
    private router: Router,
    private checkoutService: CheckoutService
  ) {}

  ngOnInit() {
    this.cartService.loadCartFromApi();
    this.cartService.cart$.subscribe((cartItems) => {
      this.cartItems = cartItems;
    });

    this.cartService.loadOrderHistory();
    this.cartService.orderHistory$.subscribe((history) => {
      this.orderHistoryList = history;
      console.log('orderHistoryList :', this.orderHistoryList);
    });

    console.log(this.productsPrice + this.pfandPrice);
  }

  increment(product: Product) {
    this.cartService.incrementQuantity(product);
    this.refreshCart();
  }

  decrement(product: Product) {
    this.cartService.decrementQuantity(product);
    this.refreshCart();
  }

  getProductTotal(): number {
    this.productsPrice = this.cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    return this.productsPrice;
  }

  getPfandTotal(): number {
    // Assumuption - fixed 0.25€ per product, just for an example
    this.pfandPrice = this.cartItems.reduce(
      (sum, item) => sum + item.quantity * 0.25,
      0
    );
    return this.pfandPrice;
  }

  getTotal(): number {
    return this.productsPrice + this.pfandPrice;
  }

  private refreshCart() {
    this.cartItems = [...this.cartService.getCart()];
  }

  goToCheckout() {
    localStorage.setItem('productPrice', this.productsPrice.toString());
    localStorage.setItem('pfandPrice', this.pfandPrice.toString());
    this.router.navigate(['/checkout/address']);
  }

  getBrandLogoUrl(sourceName: string): string {
  switch (sourceName.toUpperCase()) {
    case 'REWE':
      return 'https://upload.wikimedia.org/wikipedia/commons/5/5a/REWE_Dein_Markt-Logo_neu.png';
    case 'LIDL':
      return 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Lidl-Logo.svg/768px-Lidl-Logo.svg.png';
    case 'PENNY':
      return 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Penny-Logo.svg/2048px-Penny-Logo.svg.png';
    case 'ALDI':
      return 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/AldiWorldwideLogo.svg/1708px-AldiWorldwideLogo.svg.png';
    default:
      return '';
    }
  }
}
