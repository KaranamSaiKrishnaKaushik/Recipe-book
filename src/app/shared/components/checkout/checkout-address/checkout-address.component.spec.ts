import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CheckoutAddressComponent } from './checkout-address.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from 'src/app/shared/services/cart.service';
import { CheckoutService } from 'src/app/shared/services/checkout.service';
import { SettingsService } from 'src/app/shared/services/settings.service';
import { of, Subject } from 'rxjs';

describe('CheckoutAddressComponent', () => {
  let component: CheckoutAddressComponent;
  let fixture: ComponentFixture<CheckoutAddressComponent>;
  let mockCheckoutService: jasmine.SpyObj<CheckoutService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockSettingsService: jasmine.SpyObj<SettingsService>;
  let mockCartService: jasmine.SpyObj<CartService>;
  let userSubject: Subject<any>;

  beforeEach(async () => {
    mockCheckoutService = jasmine.createSpyObj('CheckoutService', ['setAddress']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockSettingsService = jasmine.createSpyObj('SettingsService', ['getUser', 'updateUser'], { user$: of({}) });
    mockCartService = jasmine.createSpyObj('CartService', ['dummy']);
    userSubject = new Subject();

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [CheckoutAddressComponent],
      providers: [
        FormBuilder,
        { provide: CheckoutService, useValue: mockCheckoutService },
        { provide: Router, useValue: mockRouter },
        { provide: SettingsService, useValue: { ...mockSettingsService, user$: userSubject.asObservable() } },
        { provide: CartService, useValue: mockCartService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutAddressComponent);
    component = fixture.componentInstance;
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'productPrice') return '10';
      if (key === 'pfandPrice') return '2';
      return null;
    });
    spyOn(localStorage, 'setItem');
  });

  it('should initialize prices and call getUser on ngOnInit', fakeAsync(() => {
    mockSettingsService.getUser.and.stub();
    component.init();
    fixture.detectChanges();
    userSubject.next({});
    tick();
    expect(component.productPrice).toBe(10);
    expect(component.pfand).toBe(2);
    expect(component.totalPrice).toBe(12);
    expect(mockSettingsService.getUser).toHaveBeenCalled();
  }));

  it('should initialize addressForm with user details', fakeAsync(() => {
    const user = {
      salutation: 'Mr',
      userFirstName: 'John',
      userLastName: 'Doe',
      country: 'DE',
      streetAddress: 'Main St',
      houseNumber: '1',
      zipCode: '12345',
      state: 'Berlin',
      phoneNumber: '123456789'
    };
    component.init();
    fixture.detectChanges();
    userSubject.next(user);
    tick();
    expect(component.addressForm.value).toEqual({
      salutation: 'Mr',
      firstName: 'John',
      lastName: 'Doe',
      country: 'DE',
      streetAddress: 'Main St',
      houseNumber: '1',
      zipCode: '12345',
      state: 'Berlin',
      phone: '123456789'
    });
  }));

  it('should save address and navigate to payment if form is valid', () => {
    component.userDetails = { id: 1 };
    component.init();
    component.addressForm.setValue({
      salutation: 'Ms',
      firstName: 'Jane',
      lastName: 'Smith',
      country: 'DE',
      streetAddress: 'Street',
      houseNumber: '2',
      zipCode: '54321',
      state: 'Hamburg',
      phone: '987654321'
    });
    spyOnProperty(component.addressForm, 'dirty', 'get').and.returnValue(true);
    component.saveAddress();
    expect(mockCheckoutService.setAddress).toHaveBeenCalledWith(component.addressForm.value);
    expect(localStorage.setItem).toHaveBeenCalledWith('userAddress', JSON.stringify(component.addressForm.value));
    expect(mockSettingsService.updateUser).toHaveBeenCalledWith(jasmine.objectContaining(component.addressForm.value));
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/checkout/payment']);
  });

  it('should not save address or navigate if form is invalid', () => {
    component.init();
    component.addressForm.patchValue({ firstName: '' });
    component.saveAddress();
    expect(mockCheckoutService.setAddress).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should not call updateUser if form is not dirty', () => {
    component.userDetails = { id: 1 };
    component.init();
    component.addressForm.setValue({
      salutation: 'Ms',
      firstName: 'Jane',
      lastName: 'Smith',
      country: 'DE',
      streetAddress: 'Street',
      houseNumber: '2',
      zipCode: '54321',
      state: 'Hamburg',
      phone: '987654321'
    });
    spyOnProperty(component.addressForm, 'dirty', 'get').and.returnValue(false);
    component.saveAddress();
    expect(mockSettingsService.updateUser).not.toHaveBeenCalled();
  });

  it('should navigate to /cart on cancel', () => {
    component.cancel();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/cart']);
  });

  it('should set selectedGender on selectGender', () => {
    component.selectGender('Male');
    expect(component.selectedGender).toBe('Male');
  });
});