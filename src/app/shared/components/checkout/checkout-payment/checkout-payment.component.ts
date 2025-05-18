import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CheckoutService } from 'src/app/shared/services/checkout.service';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.css']
})
export class CheckoutPaymentComponent implements OnInit {
  selectedPayment: string = '';
  paymentOptions = ['SEPA', 'Google Pay', 'Apple Pay', 'Credit Card', 'PayPal'];
  totalPrice: number = 0;
  productPrice: number = 0;
  pfand: number = 0;
  constructor(private checkoutService: CheckoutService, private router: Router) {}

    ngOnInit(): void {
    this.checkoutService.totalPrice$.subscribe(totalPrice => this.totalPrice = totalPrice);
    this.checkoutService.productsPrice$.subscribe(productPrice => this.productPrice = productPrice);
    this.checkoutService.pfandPrice$.subscribe(pfand => this.pfand = pfand);
  }

  selectPayment(option: string) {
    this.selectedPayment = option;
  }

  proceed() {
    if (this.selectedPayment) {
      //this.checkoutService.setPaymentMethod(this.selectedPayment);
      this.router.navigate(['/checkout/review']);
    }
  }

  backToAddress(){
    this.router.navigate(['/checkout/address']);  
  }
}