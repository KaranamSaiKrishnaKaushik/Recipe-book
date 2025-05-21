import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/shared/services/cart.service';
import { CheckoutService } from 'src/app/shared/services/checkout.service';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.css'],
})
export class CheckoutPaymentComponent implements OnInit {
  selectedPayment: string = '';
  paymentOptions = ['SEPA', 'Google Pay', 'Apple Pay', 'Credit Card', 'PayPal'];
  totalPrice: number = 0;
  productPrice: number = 0;
  pfand: number = 0;
  constructor(
    private checkoutService: CheckoutService,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.productPrice = +(localStorage.getItem('productPrice') ?? '0');
    this.pfand = +(localStorage.getItem('pfandPrice') ?? '0');
    this.totalPrice = this.productPrice + this.pfand;
  }

  selectPayment(option: string) {
    this.selectedPayment = option;
  }

  proceed() {
    if (this.selectedPayment) {
      //this.checkoutService.setPaymentMethod(this.selectedPayment);
      localStorage.setItem('paymentMode', this.selectedPayment);
      this.router.navigate(['/checkout/review']);
    }
  }

  backToAddress() {
    localStorage.removeItem('paymentMode');
    this.router.navigate(['/checkout/address']);
  }
}
