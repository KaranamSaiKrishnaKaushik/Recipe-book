import { Component, OnInit } from '@angular/core';
import { Product } from '../product-list/product.model';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { CheckoutService } from '../../services/checkout.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {

  cartItems: Product[] = [];
  productsPrice: number;
  pfandPrice: number;
  orderHistoryList : any;
  status: 'delivered';

  orderHistory = [
  { id: 12526, name: 'Sport Shoes', payment: 'Cash', status: 'Pending', total: 20, image: 'shoe.png' },
  { id: 52689, name: 'Watch', payment: 'Credit Card', status: 'Cancelled', total: 20, image: 'watch.png' },
  { id: 23845, name: 'Perfume', payment: 'Gpay', status: 'Delivered', total: 20, image: 'perfume.png' },
  { id: 12526, name: 'Sport Shoes', payment: 'Cash', status: 'Pending', total: 20, image: 'shoe.png' },
  { id: 52689, name: 'Watch', payment: 'Credit Card', status: 'Cancelled', total: 20, image: 'watch.png' },
  { id: 23845, name: 'Perfume', payment: 'Gpay', status: 'Delivered', total: 20, image: 'perfume.png' },
  { id: 12526, name: 'Sport Shoes', payment: 'Cash', status: 'Pending', total: 20, image: 'shoe.png' },
  { id: 52689, name: 'Watch', payment: 'Credit Card', status: 'Cancelled', total: 20, image: 'watch.png' },
  { id: 23845, name: 'Perfume', payment: 'Gpay', status: 'Delivered', total: 20, image: 'perfume.png' }
];
  constructor(private cartService: CartService, private router: Router, private checkoutService: CheckoutService) {}

  ngOnInit() {
    //this.cartItems = this.cartService.getCart();  'pfand function ': 
    this.cartService.loadCartFromApi();

    this.cartService.loadOrderHistory();

    this.cartService.cart$.subscribe(cartItems => {
    this.cartItems = cartItems;
  });

  this.cartService.orderHistory$.subscribe(history => {
  this.orderHistoryList = history;
   console.log('orderHistoryList :', this.orderHistoryList);
});

  console.log(this.productsPrice+this.pfandPrice);

 
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
    this.productsPrice = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
   // console.log('product function ', this.productsPrice+this.pfandPrice);
    return this.productsPrice;
  }

  getPfandTotal(): number {
    // Assumuption - fixed 0.25€ per product, just for an example
    this.pfandPrice = this.cartItems.reduce((sum, item) => sum + (item.quantity * 0.25), 0);
   // console.log('pfand function ', this.productsPrice+this.pfandPrice);
    return this.pfandPrice;
  }

  getTotal(): number {
    return this.productsPrice + this.pfandPrice;
  }

  private refreshCart() {
    this.cartItems = [...this.cartService.getCart()];
  }

  goToCheckout() {
  this.checkoutService.setPrices(this.productsPrice, this.pfandPrice);
  this.router.navigate(['/checkout/address']);
}
}
