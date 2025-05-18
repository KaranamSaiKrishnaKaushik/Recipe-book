import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CheckoutService } from 'src/app/shared/services/checkout.service';
import { SettingsService } from 'src/app/shared/services/settings.service';

@Component({
  selector: 'app-checkout-address',
  templateUrl: './checkout-address.component.html',
  styleUrls: ['./checkout-address.component.css']
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
    private settingsService: SettingsService) {

  }
  ngOnInit(): void {
    this.checkoutService.totalPrice$.subscribe(totalPrice => this.totalPrice = totalPrice);
    this.checkoutService.productsPrice$.subscribe(productPrice => this.productPrice = productPrice);
    this.checkoutService.pfandPrice$.subscribe(pfand => this.pfand = pfand);
    this.settingsService.getUser();
  this.settingsService.user$.subscribe(user => {
    this.userDetails = user;
    console.log('this.userDetails :', this.userDetails);
    this.init();
  });
  }

  init(){
    const user = this.userDetails || {};
    
    this.addressForm = this.fb.group({
    salutation: [user.salutation ?? '', Validators.required],
    firstName: [user.userFirstName ?? '', Validators.required],
    lastName: [user.userLastName ?? '', Validators.required],
    country: [user.country ?? '', Validators.required],
    street: [user.streetAddress ?? '', Validators.required],
    houseNumber: [user.houseNumber ?? '', Validators.required],
    postCode: [user.zipCode ?? '', Validators.required],
    state: [user.state ?? '', Validators.required],
    phone: [user.phoneNumber ?? '', Validators.required],
  });
  }

  saveAddress() {
    if (this.addressForm.valid) {
      this.checkoutService.setAddress(this.addressForm.value);
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