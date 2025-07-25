import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SettingsComponent } from './settings.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SettingsService } from '../../services/settings.service';
import { AuthService } from '../auth/auth.service';
import { of, Subject } from 'rxjs';
import { UserSettings } from '../../models/user-settings.model';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let settingsServiceSpy: jasmine.SpyObj<SettingsService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let userSubject: Subject<UserSettings>;

  beforeEach(async () => {
    userSubject = new Subject<UserSettings>();
    settingsServiceSpy = jasmine.createSpyObj('SettingsService', ['getUser', 'updateUser'], { user$: userSubject.asObservable() });
    authServiceSpy = jasmine.createSpyObj('AuthService', ['changePassword']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [SettingsComponent],
      providers: [
        FormBuilder,
        { provide: SettingsService, useValue: settingsServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'isSocialMediaAccount') return 'false';
      if (key === 'userEmail') return JSON.stringify('test@example.com');
      return null;
    });
    spyOn(localStorage, 'setItem');
    fixture.detectChanges();
  });

  it('should initialize forms on ngOnInit', () => {
    expect(component.accountForm).toBeDefined();
    expect(component.photoForm).toBeDefined();
    expect(component.addressForm).toBeDefined();
    expect(component.profileForm).toBeDefined();
    expect(component.paymentMethodForm).toBeDefined();
  });

  it('should set user data and call initForm on user$ emit', () => {
    const user: UserSettings = { userFirstName: 'John', userLastName: 'Doe' } as any;
    userSubject.next(user);
    expect(component.userSettings).toEqual(user);
    expect(component.intitails).toBe('JD');
    expect(component.fullName).toBe('John Doe');
  });

  it('should select menu', () => {
    component.selectMenu('Photo');
    expect(component.selectedMenu).toBe('Photo');
  });

  it('should get initials', () => {
    component.userSettings = { userFirstName: 'Jane', userLastName: 'Smith' } as any;
    expect(component.getInitials()).toBe('JS');
  });

  it('should return "GU" if no initials', () => {
    component.userSettings = {} as any;
    expect(component.getInitials()).toBe('GU');
  });

  it('should get full name', () => {
    component.userSettings = { userFirstName: 'Jane', userLastName: 'Smith' } as any;
    expect(component.getFullName()).toBe('Jane Smith');
  });

  it('should return "Guest User" if no full name', () => {
    component.userSettings = {} as any;
    expect(component.getFullName()).toBe('Guest User');
  });

  it('should call changePassword with email', () => {
    component.accountForm.patchValue({ email: 'test@example.com' });
    component.onChangePassword();
    expect(authServiceSpy.changePassword).toHaveBeenCalledWith('test@example.com');
  });

  it('should alert if no email on changePassword', () => {
    spyOn(window, 'alert');
    component.accountForm.patchValue({ email: '' });
    component.onChangePassword();
    expect(window.alert).toHaveBeenCalledWith('No email found in user session.');
  });

  it('should mark all as touched if accountForm invalid onChangePasswordSubmit', () => {
    spyOn(component.accountForm, 'markAllAsTouched');
    component.accountForm.setErrors({ invalid: true });
    component.onChangePasswordSubmit();
    expect(component.accountForm.markAllAsTouched).toHaveBeenCalled();
  });

  it('should call onChangePassword if accountForm valid onChangePasswordSubmit', () => {
    spyOn(component, 'onChangePassword');
    component.accountForm.setErrors(null);
    component.accountForm.patchValue({ email: 'test@example.com', currentPassword: 'a', newPassword: 'b' });
    component.onChangePasswordSubmit();
    expect(component.onChangePassword).toHaveBeenCalled();
  });

  it('should close alert', () => {
    component.showAlert = true;
    component.onCloseAlert();
    expect(component.showAlert).toBeFalse();
  });

  it('should validate password match', () => {
    const form = new FormBuilder().group({
      newPassword: ['abc'],
      confirmPassword: ['abc']
    });
    expect(component.passwordMatchValidator(form)).toBeNull();
    form.patchValue({ confirmPassword: 'def' });
    expect(component.passwordMatchValidator(form)).toEqual({ passwordMismatch: true });
  });

  it('should handle photo selection', fakeAsync(() => {
    const file = new File([''], 'photo.png', { type: 'image/png' });
    const event = { target: { files: [file] } } as any as Event;
    spyOn(FileReader.prototype, 'readAsDataURL').and.callFake(function (this: FileReader) {
      this.onload!({ target: { result: 'data:image/png;base64,abc' } } as any);
    });
    component.onPhotoSelected(event);
    tick();
    expect(component.selectedPhoto).toBe(file);
    expect(component.photoForm.get('photo')?.value).toBe(file);
  }));

  it('should not handle photo selection if no file', () => {
    const event = { target: { files: [] } } as any as Event;
    component.onPhotoSelected(event);
    expect(component.selectedPhoto).toBeNull();
  });

  it('should log photo on valid photoForm submit', () => {
    component.selectedPhoto = new File([''], 'photo.png');
    component.photoForm.get('photo')?.setValue(component.selectedPhoto);
    spyOn(console, 'log');
    component.onPhotoSubmit();
    expect(console.log).toHaveBeenCalledWith('Photo uploaded:', component.selectedPhoto);
  });

  it('should not log photo if photoForm invalid', () => {
    component.selectedPhoto = null;
    spyOn(console, 'log');
    component.onPhotoSubmit();
    expect(console.log).not.toHaveBeenCalled();
  });

  it('should update user and show alert on valid address submit', () => {
    component.userSettings = { userFirstName: 'A', userLastName: 'B' } as any;
    component.addressForm.patchValue({
      streetAddress: '123', houseNumber: '1', city: 'X', state: 'Y', ZipCode: '1234', country: 'Z'
    });
    spyOn(console, 'log');
    component.onAddressSubmit();
    expect(settingsServiceSpy.updateUser).toHaveBeenCalled();
    expect(component.showAlert).toBeTrue();
    expect(component.alertMessage).toContain('address');
    expect(component.alertType).toBe('success');
  });

  it('should not update user if addressForm invalid', () => {
    component.addressForm.setErrors({ invalid: true });
    component.onAddressSubmit();
    expect(settingsServiceSpy.updateUser).not.toHaveBeenCalled();
  });

  it('should update user and show alert on valid profile submit', () => {
    component.userSettings = { userFirstName: 'A', userLastName: 'B' } as any;
    component.profileForm.patchValue({
      salutation: 'Mr', userFirstName: 'A', userLastName: 'B', language: 'en'
    });
    spyOn(console, 'log');
    component.onProfileSubmit();
    expect(settingsServiceSpy.updateUser).toHaveBeenCalled();
    expect(component.showAlert).toBeTrue();
    expect(component.alertMessage).toContain('profile');
    expect(component.alertType).toBe('success');
  });

  it('should not update user if profileForm invalid', () => {
    component.profileForm.setErrors({ invalid: true });
    component.onProfileSubmit();
    expect(settingsServiceSpy.updateUser).not.toHaveBeenCalled();
  });

  it('should update user and show alert on valid payment method submit', () => {
    component.userSettings = { userFirstName: 'A', userLastName: 'B' } as any;
    component.paymentMethodForm.patchValue({ preferredPaymentMethod: 'card' });
    spyOn(console, 'log');
    component.onAddPaymentMethod();
    expect(settingsServiceSpy.updateUser).toHaveBeenCalled();
    expect(component.showAlert).toBeTrue();
    expect(component.alertMessage).toContain('preffered payment mode');
    expect(component.alertType).toBe('success');
  });

  it('should not update user if paymentMethodForm invalid', () => {
    component.paymentMethodForm.setErrors({ invalid: true });
    component.onAddPaymentMethod();
    expect(settingsServiceSpy.updateUser).not.toHaveBeenCalled();
  });
});