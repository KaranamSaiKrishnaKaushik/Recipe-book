import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from 'src/app/shared/services/cart.service';
import { CheckoutService } from 'src/app/shared/services/checkout.service';
import { SettingsService } from 'src/app/shared/services/settings.service';

@Component({
  selector: 'app-checkout-address',
  templateUrl: './checkout-address.component.html',
  styleUrls: ['./checkout-address.component.css'],
})
export class CheckoutAddressComponent implements OnInit {
  addressForm!: FormGroup;
  totalPrice: number = 0;
  productPrice: number = 0;
  pfand: number = 0;
  userDetails: any;
  selectedGender: string = '';
  genderOptions = ['Female', 'Male', 'Neutral'];

  constructor(
    private fb: FormBuilder,
    private checkoutService: CheckoutService,
    private router: Router,
    private settingsService: SettingsService,
    private cartService: CartService
  ) {}
  ngOnInit(): void {
    this.productPrice = +(localStorage.getItem('productPrice') ?? '0');
    this.pfand = +(localStorage.getItem('pfandPrice') ?? '0');
    this.totalPrice = this.productPrice + this.pfand;

    this.settingsService.getUser();
    this.settingsService.user$.subscribe((user) => {
      this.userDetails = user;
      console.log('this.userDetails :', this.userDetails);
      this.init();
    });
  }

  init() {
    const user = this.userDetails || {};

    this.addressForm = this.fb.group({
      salutation: [user.salutation ?? '', Validators.required],
      firstName: [user.userFirstName ?? '', Validators.required],
      lastName: [user.userLastName ?? '', Validators.required],
      country: [user.country ?? '', Validators.required],
      streetAddress: [user.streetAddress ?? '', Validators.required],
      houseNumber: [user.houseNumber ?? '', Validators.required],
      zipCode: [user.zipCode ?? '', Validators.required],
      state: [user.state ?? '', Validators.required],
      phone: [user.phoneNumber ?? '', Validators.required],
    });
  }

  saveAddress() {
    if (this.addressForm.valid) {
      this.checkoutService.setAddress(this.addressForm.value);
      localStorage.setItem(
        'userAddress',
        JSON.stringify(this.addressForm.value)
      );
      if (this.addressForm.dirty) {
        const updatedUser = {
          ...this.userDetails,
          ...this.addressForm.value,
        };
        console.log('Address changed, updating user:', updatedUser);
        this.settingsService.updateUser(updatedUser);
      }
      this.router.navigate(['/checkout/payment']);
    }
  }

  cancel() {
    this.router.navigate(['/cart']);
  }

  selectGender(option: string) {
    this.selectedGender = option;
  }
}
