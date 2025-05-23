import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/shared/services/cart.service';
import { CheckoutService } from 'src/app/shared/services/checkout.service';
import { SettingsService } from 'src/app/shared/services/settings.service';
import { User } from '../../auth/user.model';

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
  userDetails: any;
  savedPayment: any;
  constructor(
    private checkoutService: CheckoutService,
    private router: Router,
    private cartService: CartService,
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this.productPrice = +(localStorage.getItem('productPrice') ?? '0');
    this.pfand = +(localStorage.getItem('pfandPrice') ?? '0');
    this.totalPrice = this.productPrice + this.pfand;

    this.settingsService.getUser();
    this.settingsService.user$.subscribe((user) => {
      this.userDetails = user;
      console.log('this.userDetails :', this.userDetails);
      this.savedPayment = user?.preferredPaymentMethod;
      if (this.savedPayment) {
          this.selectedPayment = this.savedPayment;
        }
    });
  }

  selectPayment(option: string) {
    this.selectedPayment = option;
  }

  proceed() {
    if(this.savedPayment === this.selectedPayment){
      console.log("Payment method matches");
    }else{
      console.log(this.userDetails);
      this.userDetails.setPaymentMethod(this.selectedPayment);
      this.settingsService.updateUser(this.userDetails);
      console.log("Payment method doesnt match");
    }
    if (this.selectedPayment) {
      localStorage.setItem('paymentMode', this.selectedPayment);
      this.router.navigate(['/checkout/review']);
    }
  }

  backToAddress() {
    localStorage.removeItem('paymentMode');
    this.router.navigate(['/checkout/address']);
  }
}
