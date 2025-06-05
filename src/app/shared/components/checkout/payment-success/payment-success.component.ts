import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartService } from 'src/app/shared/services/cart.service';
import {
  CheckoutService,
  PaymentOrderDetails,
} from 'src/app/shared/services/checkout.service';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css'],
})
export class PaymentSuccessComponent implements OnInit {
  orderNumber: string = '';
  date: string = '';
  paymentMethod: string = '';
  total: number = 0;
  email: string = '';

  paymentOrderDetails: PaymentOrderDetails;

  constructor(
    private route: ActivatedRoute,
    private checkoutService: CheckoutService,
    private cartService: CartService
  ) {
    this.orderNumber = '#246258';
    this.date = '07/10/2024';
    this.paymentMethod = 'Paypal';
    this.total = 480;
    this.email = 'kc@cactus.co';
  }
  ngOnInit(): void {
    this.email = JSON.parse(localStorage.getItem('userEmail') ?? '{}');
    this.checkoutService.orderDetails$.subscribe((order) => {
      this.cartService.loadCartFromApi();
      if (order) {
        console.log('New order:', order);
        this.paymentOrderDetails = order;
      }
    });
  }

  viewInvoice() {
    window.open('/assets/invoice.pdf', '_blank');
  }
}
