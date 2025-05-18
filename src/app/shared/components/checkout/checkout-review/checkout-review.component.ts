import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/shared/services/cart.service';
import { CheckoutService, PaymentOrderDetails } from 'src/app/shared/services/checkout.service';
import { environment } from 'src/environments/environment';
import { Product } from '../../product-list/product.model';

declare var paypal: any;

@Component({
  selector: 'app-checkout-review',
  templateUrl: './checkout-review.component.html',
  styleUrls: ['./checkout-review.component.css'],
})
export class CheckoutReviewComponent implements OnInit {
  address = this.checkoutService.getAddress();
  paymentMethod = 'Paypal'; //this.checkoutService.getPaymentMethod();
  total = 51.2; //this.checkoutService.getTotal();
  paypalSandboxClientId = environment.paypalSandboxClientId;
  private apiUrl = environment.apiUrl;
  totalPrice: number = 0;
  productPrice: number = 0;
  pfand: number = 0;
  cartItems: Product[];

  constructor(
    private checkoutService: CheckoutService,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.checkoutService.totalPrice$.subscribe(
      (totalPrice) => (this.totalPrice = totalPrice)
    );
    this.checkoutService.productsPrice$.subscribe(
      (productPrice) => (this.productPrice = productPrice)
    );
    this.checkoutService.pfandPrice$.subscribe((pfand) => (this.pfand = pfand));

    this.cartService.cart$.subscribe((cartItems) => {
      this.cartItems = cartItems;
    });
  }
  placeOrder() {
    if (this.cartItems.length > 0) {
      console.log('Cart Items :', this.cartItems);
      this.checkoutService.placeOrderWithAllCartItems(this.cartItems);
    } else {
      alert(
        'There are no items in your cart. Please add items into your cart from the Product List!'
      );
    }
  }

  backToPayment() {
    this.router.navigate(['/checkout/payment']);
  }

  toPaymentSuccess() {
    this.router.navigate(['/checkout/payment-success']);
  }

  ngAfterViewInit() {
    if (typeof paypal !== 'undefined') {
      this.loadPaypalScript().then(() => {
        paypal
          .Buttons({
            createOrder: (data: any, actions: any) => {
              return fetch(this.apiUrl + 'api/paypal/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ value: this.totalPrice.toFixed(2).toString() }),
              })
                .then((res) => {
                  if (!res.ok)
                    throw new Error(`Create Order failed: ${res.status}`);
                  return res.json();
                })
                .then((order) => order.id);
            },
            onApprove: (data: any, actions: any) => {
              return fetch(this.apiUrl + 'api/paypal/capture-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId: data.orderID }),
              })
                .then((res) => {
                  if (!res.ok)
                    throw new Error(`Capture Order failed: ${res.status}`);
                  return res.json();
                })
                .then((details) => {
                  let amount =
                    details.purchase_units[0].payments.captures[0].amount.value;
                  let currency =
                    details.purchase_units[0].payments.captures[0].amount
                      .currency_code;
                  this.placeOrder();
                  console.log(
                    'Transaction of ' +
                      amount +
                      ' ' +
                      currency +
                      ' completed by ' +
                      details.payer.name.given_name +
                      ' order Id :' +
                      data.orderID
                  );
                  //alert('Transaction of '+ amount +' '+ currency+' completed by ' + details.payer.name.given_name);
                  this.toPaymentSuccess();
                })
                .catch((err) => {
                  console.error('PayPal Order Error:', err);
                });
            },
          })
          .render('#paypal-button-container');
      });
    } else {
      console.error('PayPal SDK not loaded.');
    }
  }

  loadPaypalScript(): Promise<void> {
    return new Promise((resolve) => {
      if ((window as any).paypal) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src =
        'https://www.paypal.com/sdk/js?client-id=' +
        this.paypalSandboxClientId +
        '&currency=EUR';
      script.onload = () => resolve();
      document.body.appendChild(script);
    });
  }
}
