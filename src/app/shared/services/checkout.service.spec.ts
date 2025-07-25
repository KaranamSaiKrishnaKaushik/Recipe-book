import { TestBed } from '@angular/core/testing';
import { CheckoutService, PaymentOrderDetails } from './checkout.service';
import { CartService } from './cart.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Product } from '../components/product-list/product.model';

describe('CheckoutService', () => {
    let service: CheckoutService;
    let cartServiceSpy: jasmine.SpyObj<CartService>;
    let httpClientSpy: jasmine.SpyObj<HttpClient>;

    beforeEach(() => {
        cartServiceSpy = jasmine.createSpyObj('CartService', ['getCart']);
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);

        TestBed.configureTestingModule({
            providers: [
                CheckoutService,
                { provide: CartService, useValue: cartServiceSpy },
                { provide: HttpClient, useValue: httpClientSpy }
            ]
        });

        service = TestBed.inject(CheckoutService);
    });

    it('should set and get address', () => {
        const address = { street: '123 Main St' };
        service.setAddress(address);
        expect(service.getAddress()).toEqual(address);
    });

    it('should set and get payment method', () => {
        service.setPayment('CreditCard');
        expect(service.getPayment()).toBe('CreditCard');
    });

    it('should initialize currentCart on ngOnInit', () => {
        const cart: Product[] = [{
            id: '1',
            name: 'Test',
            price: 10,
            currency: 'USD',
            customerReview: '',
            reviewCount: '0',
            imageLink: '',
            category: '',
            productLink: '',
            productId: '',
            grammage: '',
            sourceName: '',
            isOnSale: false,
            quantity: 1
        }];
        cartServiceSpy.getCart.and.returnValue(cart);
        service.ngOnInit();
        expect(service.currentCart).toEqual(cart);
    });

    it('should call httpClient.post and update currentOrderDetails on placeOrderWithAllCartItems', () => {
        const cartItems: Product[] = [{
            id: '1',
            name: 'Test',
            price: 10,
            currency: 'USD',
            customerReview: '',
            reviewCount: '0',
            imageLink: '',
            category: '',
            productLink: '',
            productId: '',
            grammage: '',
            sourceName: '',
            isOnSale: false,
            quantity: 1
        }];
        const apiResponse: PaymentOrderDetails = {
            orderId: '123',
            totalOrderPrice: '100',
            createdDateTime: '2024-06-01T12:00:00',
            isPaymentCompleted: true,
            paymentMode: 'Paypal'
        };
        httpClientSpy.post.and.returnValue(of(apiResponse));

        let result: PaymentOrderDetails | null = null;
        service.orderDetails$.subscribe(val => result = val);

        service.placeOrderWithAllCartItems(cartItems);

        expect(httpClientSpy.post).toHaveBeenCalledWith(jasmine.stringMatching(/api\/orders\/place-order/), cartItems);
        expect(result).toEqual(jasmine.objectContaining({
            orderId: '123',
            totalOrderPrice: '100',
            createdDateTime: '2024-06-01',
            isPaymentCompleted: true,
            paymentMode: 'Paypal'
        }));
    });

    it('storeOrderDetailesOfCompletedPayment should be defined', () => {
        expect(service.storeOrderDetailesOfCompletedPayment).toBeDefined();
    });
});