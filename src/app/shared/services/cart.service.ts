import { HostListener, Injectable } from '@angular/core';
import { Product } from '../components/product-list/product.model';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Cart } from '../components/shopping-cart/cart.model';
import { BehaviorSubject, debounceTime, Subject } from 'rxjs';
import { PaymentOrderDetails } from './checkout.service';

export interface OrderedItemHistory {
  orderId: string;
  name: string;
  price: string;
  category: string;
  isOnSale: string;
  // totalOrderPrice: number;
  createdDateTime: string;
  sourceName: string;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private cart: Product[] = [];
  url = environment.apiUrl;
  private cartSubject = new BehaviorSubject<Product[]>([]);
  cart$ = this.cartSubject.asObservable();
  private cartChanged = new Subject<void>();

  private orderHistoryChanged = new BehaviorSubject<PaymentOrderDetails[]>([]);
  orderHistory$ = this.orderHistoryChanged.asObservable();

  private orderedItemHistoryChanged = new BehaviorSubject<OrderedItemHistory[]>([]);
  orderedItemHistory$ = this.orderedItemHistoryChanged.asObservable();

  constructor(private httpClient: HttpClient) {}

  getCart(): Product[] {
    return this.cart;
  }

  addToCart(product: Product) {
    const existing = this.cart.find((p) => p.productId === product.productId);
    if (existing) {
      existing.quantity++;
      this.updateCartProduct(existing);
    } else {
      this.cart.push({ ...product, quantity: 1 });
      this.updateCartProduct(product);
    }
  }

  incrementQuantity(product: Product) {
    const item = this.cart.find(
        (p) => 
            p.productId === product.productId
    );
    if (item) 
        {
            item.quantity++;
            this.updateCartProduct(item);

        }
  }

  decrementQuantity(product: Product) {
    const item = this.cart.find(
        (p) => 
            p.productId === product.productId
    );
    if (item) {
      item.quantity--;
      if (item.quantity <= 0) {
        this.cart = this.cart.filter((p) => p.id !== product.id);
      }else{
        this.updateCartProduct(item);
      }
    
    }
  }

  removeCartProduct(productId: string) {
  this.httpClient
    .delete(this.url + `api/products/remove-from-cart/${productId}`)
    .subscribe(() => {
      console.log('Product removed from cart');
    });
}

  updateCartProduct(product: Product) {
    const body = {
      ProductId: product.productId,
      Quantity: product.quantity,
    };
    this.httpClient
      .post<Cart[]>(this.url + 'api/products/add-to-shopping-cart', body)
      .subscribe((cartProducts) => {
        console.log('Cart Updated');
      });
  }

  loadCartFromApi() {
    this.httpClient
      .get<Product[]>(this.url + 'api/products/shopping-cart-list')
      .subscribe((cartProducts) => {
        this.cart = cartProducts;
        this.cartSubject.next(this.cart);
      });
  }

  
  loadOrderHistory() {
    this.httpClient
      .get<any[]>(this.url + 'api/orders/history')
      .subscribe((history) => {
        const mappedHistory: PaymentOrderDetails[] = history.map(order => ({
        orderId: order.orderId,
        totalOrderPrice: order.totalOrderPrice, // Convert to string if needed
        createdDateTime: order.createdDateTime.split('T')[0], // Format date
        isPaymentCompleted: order.isPaymentCompleted,
        paymentMode: 'Paypal' // Or derive from actual value if available
      }));

      this.orderHistoryChanged.next(mappedHistory);
      });
  }

    loadOrderedItemHistory() {
    this.httpClient
      .get<any[]>(this.url + 'api/orders/items')
      .subscribe((history) => {
        const mappedHistory: OrderedItemHistory[] = history.map(order => ({
        orderId: order.orderId,
        name: order.name,
        price: order.price,
        createdDateTime: order.createdDateTime.split('T')[0],
        category: order.category,
        isOnSale: order.isOnSale, 
        sourceName: order.sourceName
      }));

      this.orderedItemHistoryChanged.next(mappedHistory);
      });
  }

  saveCartProducts() {
    const body = this.cart.map((item) => ({
      ProductId: item.productId,
      Quantity: item.quantity,
    }));

    this.httpClient
      .post(this.url + 'api/products/add-cart-bulk', body)
      .subscribe(() => console.log('Cart saved'));
  }
  
}
