import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentSuccessComponent } from './payment-success.component';
import { ActivatedRoute } from '@angular/router';
import { CartService } from 'src/app/shared/services/cart.service';
import { CheckoutService, PaymentOrderDetails } from 'src/app/shared/services/checkout.service';
import { of, Subject } from 'rxjs';

describe('PaymentSuccessComponent', () => {
  let component: PaymentSuccessComponent;
  let fixture: ComponentFixture<PaymentSuccessComponent>;
  let mockCartService: jasmine.SpyObj<CartService>;
  let mockCheckoutService: jasmine.SpyObj<CheckoutService>;
  let orderDetailsSubject: Subject<PaymentOrderDetails>;

  beforeEach(async () => {
    mockCartService = jasmine.createSpyObj('CartService', ['loadCartFromApi']);
    orderDetailsSubject = new Subject<PaymentOrderDetails>();
    mockCheckoutService = jasmine.createSpyObj('CheckoutService', [], {
      orderDetails$: orderDetailsSubject.asObservable()
    });

    await TestBed.configureTestingModule({
      declarations: [PaymentSuccessComponent],
      providers: [
        { provide: ActivatedRoute, useValue: {} },
        { provide: CartService, useValue: mockCartService },
        { provide: CheckoutService, useValue: mockCheckoutService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentSuccessComponent);
    component = fixture.componentInstance;
    localStorage.clear();
  });

  it('should initialize default values in constructor', () => {
    expect(component.orderNumber).toBe('#246258');
    expect(component.date).toBe('07/10/2024');
    expect(component.paymentMethod).toBe('Paypal');
    expect(component.total).toBe(480);
    expect(component.email).toBe('kc@cactus.co');
  });

  it('should set email from localStorage on ngOnInit', () => {
    localStorage.setItem('userEmail', JSON.stringify('test@email.com'));
    component.ngOnInit();
    expect(component.email).toBe('test@email.com');
  });

  it('should set email to empty string if localStorage is empty', () => {
    localStorage.removeItem('userEmail');
    component.ngOnInit();
    expect(component.email).toEqual('');
  });

  it('should call cartService.loadCartFromApi and set paymentOrderDetails on orderDetails$ emit', () => {
    const order: PaymentOrderDetails = { id: 1, total: 100 } as any;
    spyOn(console, 'log');
    component.ngOnInit();
    orderDetailsSubject.next(order);
    expect(mockCartService.loadCartFromApi).toHaveBeenCalled();
    expect(component.paymentOrderDetails).toBe(order);
    expect(console.log).toHaveBeenCalledWith('New order:', order);
  });

  it('should not set paymentOrderDetails if order is falsy', () => {
    component.ngOnInit();
    orderDetailsSubject.next(null as any);
    expect(component.paymentOrderDetails).toBeUndefined();
  });

  it('should open invoice in new tab when viewInvoice is called', () => {
    spyOn(window, 'open');
    component.viewInvoice();
    expect(window.open).toHaveBeenCalledWith('/assets/invoice.pdf', '_blank');
  });
});