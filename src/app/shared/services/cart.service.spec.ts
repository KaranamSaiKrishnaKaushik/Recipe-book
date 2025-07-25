import { TestBed } from '@angular/core/testing';
import { CartService, OrderedItemHistory } from './cart.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Product } from '../components/product-list/product.model';
import { environment } from 'src/environments/environment';
import { PaymentOrderDetails } from './checkout.service';

describe('CartService', () => {
    let service: CartService;
    let httpMock: HttpTestingController;
    const apiUrl = environment.apiUrl;

    const mockProduct: Product = {
        id: '1',
        productId: '1',
        name: 'Test Product',
        price: 10,
        quantity: 1,
        category: 'Test',
        isOnSale: false,
        currency: 'USD',
        customerReview: '',
        reviewCount: '0',
        imageLink: '',
        productLink: '',
        grammage: '',
        sourceName: ''
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [CartService]
        });
        service = TestBed.inject(CartService);
        httpMock = TestBed.inject(HttpTestingController);
        service['cart'] = [];
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should add a new product to cart', () => {
        service.addToCart(mockProduct);
        expect(service.getCart().length).toBe(1);
        expect(service.getCart()[0].quantity).toBe(1);

        // Should call updateCartProduct (POST)
        httpMock.expectOne(apiUrl + 'api/products/add-to-shopping-cart').flush([]);
    //.flush([]) is like saying "Yes, the server responded successfully" so your test can verify that your service handles both local state management AND successful API integration correctly.
    });

    it('should increment quantity if product already exists in cart', () => {
        service['cart'] = [{ ...mockProduct }];
        service.addToCart(mockProduct);
        expect(service.getCart()[0].quantity).toBe(2);

        // Should call updateCartProduct (POST)
        httpMock.expectOne(apiUrl + 'api/products/add-to-shopping-cart').flush([]);
    });

    it('should increment product quantity', () => {
        service['cart'] = [{ ...mockProduct }];
        service.incrementQuantity(mockProduct);
        expect(service.getCart()[0].quantity).toBe(2);

        httpMock.expectOne(apiUrl + 'api/products/add-to-shopping-cart').flush([]);
    });

    it('should decrement product quantity and remove if zero', () => {
        service['cart'] = [{ ...mockProduct, quantity: 1 }];
        service.decrementQuantity(mockProduct);

        // Should call removeCartProduct (DELETE)
        httpMock.expectOne(apiUrl + 'api/products/remove-from-cart/1').flush({});
        expect(service.getCart().length).toBe(0);
    });

    it('should decrement product quantity and update if above zero', () => {
        service['cart'] = [{ ...mockProduct, quantity: 2 }];
        service.decrementQuantity(mockProduct);

        expect(service.getCart()[0].quantity).toBe(1);
        httpMock.expectOne(apiUrl + 'api/products/add-to-shopping-cart').flush([]);
    });

    it('should remove product from cart', () => {
        service['cart'] = [{ ...mockProduct }];
        service.removeCartProduct('1');
        httpMock.expectOne(apiUrl + 'api/products/remove-from-cart/1').flush({});
    });

    it('should update cart product', () => {
        service['cart'] = [{ ...mockProduct }];
        service.updateCartProduct(mockProduct);
        httpMock.expectOne(apiUrl + 'api/products/add-to-shopping-cart').flush([]);
    });

    it('should load cart from API', () => {
        const products: Product[] = [{ ...mockProduct }];
        service.loadCartFromApi();
        const req = httpMock.expectOne(apiUrl + 'api/products/shopping-cart-list');
        req.flush(products);
        expect(service.getCart()).toEqual(products);
    });

    it('should load order history', () => {
        const apiHistory = [
            {
                orderId: 'o1',
                totalOrderPrice: '100',
                createdDateTime: '2024-01-01T12:00:00',
                isPaymentCompleted: true
            }
        ];
        let result: PaymentOrderDetails[] | undefined;
        service.orderHistory$.subscribe(history => result = history);

        service.loadOrderHistory();
        httpMock.expectOne(apiUrl + 'api/orders/history').flush(apiHistory);

        expect(result).toEqual([
            {
                orderId: 'o1',
                totalOrderPrice: '100',
                createdDateTime: '2024-01-01',
                isPaymentCompleted: true,
                paymentMode: 'Paypal'
            }
        ]);
    });

    it('should load ordered item history', () => {
        const apiHistory = [
            {
                orderId: 'o1',
                name: 'Item1',
                price: '10',
                createdDateTime: '2024-01-01T12:00:00',
                category: 'Cat',
                isOnSale: 'false',
                sourceName: 'Web'
            }
        ];
        let result: OrderedItemHistory[] | undefined;
        service.orderedItemHistory$.subscribe(history => result = history);

        service.loadOrderedItemHistory();
        httpMock.expectOne(apiUrl + 'api/orders/items').flush(apiHistory);

        expect(result).toEqual([
            {
                orderId: 'o1',
                name: 'Item1',
                price: '10',
                createdDateTime: '2024-01-01',
                category: 'Cat',
                isOnSale: 'false',
                sourceName: 'Web'
            }
        ]);
    });

    it('should save cart products', () => {
        service['cart'] = [{ ...mockProduct, quantity: 2 }];
        service.saveCartProducts();
        httpMock.expectOne(apiUrl + 'api/products/add-cart-bulk').flush({});
    });
});