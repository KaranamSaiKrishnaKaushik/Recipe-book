import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CheckoutReviewComponent } from './checkout-review.component';
import { Router } from '@angular/router';
import { CartService } from 'src/app/shared/services/cart.service';
import { CheckoutService } from 'src/app/shared/services/checkout.service';
import { of, Subject } from 'rxjs';
import { Product } from '../../product-list/product.model';

describe('CheckoutReviewComponent', () => {
  let component: CheckoutReviewComponent;
  let fixture: ComponentFixture<CheckoutReviewComponent>;
  let mockRouter: any;
  let mockCartService: any;
  let mockCheckoutService: any;
  let cartSubject: Subject<Product[]>;

  beforeEach(async () => {
    cartSubject = new Subject<Product[]>();
    mockRouter = { navigate: jasmine.createSpy('navigate') };
    mockCartService = {
      loadCartFromApi: jasmine.createSpy('loadCartFromApi'),
      cart$: cartSubject.asObservable()
    };
    mockCheckoutService = {
      getAddress: jasmine.createSpy('getAddress').and.returnValue({ street: 'Test St' }),
      placeOrderWithAllCartItems: jasmine.createSpy('placeOrderWithAllCartItems')
    };

    await TestBed.configureTestingModule({
      declarations: [CheckoutReviewComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: CartService, useValue: mockCartService },
        { provide: CheckoutService, useValue: mockCheckoutService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutReviewComponent);
    component = fixture.componentInstance;
    spyOn(window.localStorage, 'getItem').and.callFake((key: string) => {
      switch (key) {
        case 'productPrice': return '10';
        case 'pfandPrice': return '2';
        case 'paymentMode': return 'Paypal';
        case 'userAddress': return JSON.stringify({ street: 'Test St' });
        default: return null;
      }
    });
    spyOn(window.localStorage, 'removeItem');
    spyOn(window, 'alert');
    spyOn(console, 'log');
    spyOn(console, 'error');
  });

  it('should initialize values on ngOnInit', fakeAsync(() => {
    // Mock paypal.Buttons to prevent TypeError during test
    (window as any).paypal = {
      Buttons: jasmine.createSpy('Buttons').and.returnValue({ render: jasmine.createSpy('render') })
    };
    fixture.detectChanges();
    cartSubject.next([{
      id: '1',
      name: 'Test',
      price: 10,
      currency: 'USD',
      customerReview: '',
      reviewCount: '0',
      imageLink: '',
      description: '',
      category: '',
      stock: 0,
      pfand: 0,
      isAvailable: true,
      productLink: '',
      productId: '1',
      grammage: '',
      sourceName: '',
      sourceId: 0,
      allergens: '',
      isOnSale: false,
      quantity: 1
    } as Product]);
    component.ngOnInit();
    expect(mockCartService.loadCartFromApi).toHaveBeenCalled();
    expect(component.productPrice).toBe(10);
    expect(component.pfand).toBe(2);
    expect(component.totalPrice).toBe(12);
    expect(component.paymentMethod).toBe('Paypal');
    expect(component.address).toEqual({ street: 'Test St' });
  }));

  it('should call placeOrderWithAllCartItems if cartItems is not empty', () => {
    component.cartItems = [{
      id: '1',
      name: 'Test',
      price: 10,
      currency: 'USD',
      customerReview: '',
      reviewCount: '0',
      imageLink: '',
      description: '',
      category: '',
      stock: 0,
      pfand: 0,
      isAvailable: true,
      productLink: '',
      productId: '1',
      grammage: '',
      sourceName: '',
      sourceId: 0,
      allergens: '',
      isOnSale: false,
      quantity: 1
    } as Product];
    component.placeOrder();
    expect(mockCheckoutService.placeOrderWithAllCartItems).toHaveBeenCalledWith(component.cartItems);
    expect(window.alert).not.toHaveBeenCalled();
  });

  it('should alert if cartItems is empty', () => {
    component.cartItems = [];
    component.placeOrder();
    expect(window.alert).toHaveBeenCalledWith(
      'There are no items in your cart. Please add items into your cart from the Product List!'
    );
    expect(mockCheckoutService.placeOrderWithAllCartItems).not.toHaveBeenCalled();
  });

  it('should navigate to payment on backToPayment', () => {
    component.backToPayment();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/checkout/payment']);
  });

  it('should navigate to payment-success on toPaymentSuccess', () => {
    component.toPaymentSuccess();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/checkout/payment-success']);
  });

  it('should resolve immediately if paypal is already loaded in loadPaypalScript', fakeAsync(() => {
    (window as any).paypal = {};
    let resolved = false;
    component.loadPaypalScript().then(() => resolved = true);
    tick();
    expect(resolved).toBeTrue();
  }));

  it('should append script if paypal is not loaded in loadPaypalScript', fakeAsync(() => {
    delete (window as any).paypal;
    const appendSpy = spyOn(document.body, 'appendChild').and.callThrough();
    let resolved = false;
    component.paypalSandboxClientId = 'test-client-id';
    component.loadPaypalScript().then(() => resolved = true);
    const script = document.querySelector('script[src*="paypal.com"]');
    expect(appendSpy).toHaveBeenCalled();
    expect(script).toBeTruthy();
    (script as any).onload();
    tick();
    expect(resolved).toBeTrue();
    script?.remove();
  }));

  it('should log error if paypal is undefined in ngAfterViewInit', () => {
    (window as any).paypal = undefined;
    component.ngAfterViewInit();
    expect(console.error).toHaveBeenCalledWith('PayPal SDK not loaded.');
  });

  it('should call paypal.Buttons and render if paypal is defined in ngAfterViewInit', fakeAsync(() => {
    const renderSpy = jasmine.createSpy('render');
    (window as any).paypal = {
      Buttons: jasmine.createSpy('Buttons').and.returnValue({ render: renderSpy })
    };
    spyOn(component, 'loadPaypalScript').and.returnValue(Promise.resolve());
    component.ngAfterViewInit();
    tick();
    expect((window as any).paypal.Buttons).toHaveBeenCalled();
    expect(renderSpy).toHaveBeenCalledWith('#paypal-button-container');
  }));

  afterEach(() => {
    // Clean up any appended scripts
    document.querySelectorAll('script[src*="paypal.com"]').forEach(s => s.remove());
  });
});