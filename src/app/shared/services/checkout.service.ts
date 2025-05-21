import { Injectable, OnInit } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { CartService } from "./cart.service";
import { Product } from "../components/product-list/product.model";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";

 export interface PaymentOrderDetails{
  orderId: string;
  totalOrderPrice: string;
  createdDateTime: string;
  isPaymentCompleted: boolean;
  paymentMode: string;
}

@Injectable({ providedIn: 'root' })
export class CheckoutService implements OnInit{

  url = environment.apiUrl;
  currentCart: Product[];
  currentOrderDetails = new BehaviorSubject<PaymentOrderDetails | null>(null);
   orderDetails$: Observable<PaymentOrderDetails | null> = this.currentOrderDetails.asObservable();
  constructor(
    private cartService: CartService,
    private httpClient: HttpClient){}
  ngOnInit(): void {
    this.currentCart = this.cartService.getCart();
  }

  private address: any;
  private paymentMethod: string;


  setAddress(addr: any) { this.address = addr; }
  getAddress() { return this.address; }

  setPayment(method: string) { this.paymentMethod = method; }
  getPayment() { return this.paymentMethod; }


  placeOrderWithAllCartItems(cartItems: Product[]) {
      this.httpClient
        .post<PaymentOrderDetails>(this.url + 'api/orders/place-order', cartItems)
        .subscribe((res) => {
           const formattedOrderDetails: PaymentOrderDetails = {
        orderId: res.orderId,
        totalOrderPrice: res.totalOrderPrice,
        createdDateTime: res.createdDateTime.split('T')[0],
        isPaymentCompleted: res.isPaymentCompleted,
        paymentMode: 'Paypal' 
      };

      this.currentOrderDetails.next(formattedOrderDetails); 
        });
    }
   
  storeOrderDetailesOfCompletedPayment(){

  }
}
