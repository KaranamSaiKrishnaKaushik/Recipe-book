import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CheckoutPaymentComponent } from './checkout-payment.component';
import { Router } from '@angular/router';
import { CartService } from 'src/app/shared/services/cart.service';
import { CheckoutService } from 'src/app/shared/services/checkout.service';
import { SettingsService } from 'src/app/shared/services/settings.service';
import { of, Subject } from 'rxjs';

describe('CheckoutPaymentComponent', () => {
  let component: CheckoutPaymentComponent;
  let fixture: ComponentFixture<CheckoutPaymentComponent>;
  let mockRouter: any;
  let mockCartService: any;
  let mockCheckoutService: any;
  let mockSettingsService: any;
  let userSubject: Subject<any>;

  beforeEach(async () => {
    userSubject = new Subject();
    mockRouter = { navigate: jasmine.createSpy('navigate') };
    mockCartService = {};
    mockCheckoutService = {};
    mockSettingsService = {
      getUser: jasmine.createSpy('getUser'),
      user$: userSubject.asObservable(),
      updateUser: jasmine.createSpy('updateUser')
    };

    await TestBed.configureTestingModule({
      declarations: [CheckoutPaymentComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: CartService, useValue: mockCartService },
        { provide: CheckoutService, useValue: mockCheckoutService },
        { provide: SettingsService, useValue: mockSettingsService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutPaymentComponent);
    component = fixture.componentInstance;
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'productPrice') return '10';
      if (key === 'pfandPrice') return '2';
      return null;
    });
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'removeItem');
  });

  it('should initialize prices and call getUser on ngOnInit', fakeAsync(() => {
    component.ngOnInit();
    expect(component.productPrice).toBe(10);
    expect(component.pfand).toBe(2);
    expect(component.totalPrice).toBe(12);
    expect(mockSettingsService.getUser).toHaveBeenCalled();
  }));

  it('should set userDetails and savedPayment from user$ subscription', fakeAsync(() => {
    component.ngOnInit();
    const user = { preferredPaymentMethod: 'PayPal' };
    userSubject.next(user);
    tick();
    expect(component.userDetails).toEqual(user);
    expect(component.savedPayment).toBe('PayPal');
    expect(component.selectedPayment).toBe('PayPal');
  }));

  it('should not set selectedPayment if no savedPayment', fakeAsync(() => {
    component.ngOnInit();
    const user = {};
    userSubject.next(user);
    tick();
    expect(component.selectedPayment).toBe('');
  }));

  it('should update selectedPayment when selectPayment is called', () => {
    component.selectPayment('SEPA');
    expect(component.selectedPayment).toBe('SEPA');
  });

  it('should navigate to review and not update user if payment matches', () => {
    component.savedPayment = 'SEPA';
    component.selectedPayment = 'SEPA';
    component.userDetails = { setPaymentMethod: jasmine.createSpy('setPaymentMethod') };
    component.proceed();
    expect(localStorage.setItem).toHaveBeenCalledWith('paymentMode', 'SEPA');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/checkout/review']);
    expect(component.userDetails.setPaymentMethod).not.toHaveBeenCalled();
    expect(mockSettingsService.updateUser).not.toHaveBeenCalled();
  });

  it('should update user and navigate if payment does not match', () => {
    const setPaymentMethodSpy = jasmine.createSpy('setPaymentMethod');
    component.savedPayment = 'PayPal';
    component.selectedPayment = 'SEPA';
    component.userDetails = { setPaymentMethod: setPaymentMethodSpy };
    component.proceed();
    expect(setPaymentMethodSpy).toHaveBeenCalledWith('SEPA');
    expect(mockSettingsService.updateUser).toHaveBeenCalledWith(component.userDetails);
    expect(localStorage.setItem).toHaveBeenCalledWith('paymentMode', 'SEPA');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/checkout/review']);
  });

  it('should not navigate if selectedPayment is empty', () => {
    component.selectedPayment = '';
    component.savedPayment = '';
    component.userDetails = { setPaymentMethod: jasmine.createSpy('setPaymentMethod') };
    component.proceed();
    expect(localStorage.setItem).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should remove paymentMode and navigate to address on backToAddress', () => {
    component.backToAddress();
    expect(localStorage.removeItem).toHaveBeenCalledWith('paymentMode');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/checkout/address']);
  });
});