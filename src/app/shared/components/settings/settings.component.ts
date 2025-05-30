import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SettingsService } from '../../services/settings.service';
import { UserSettings } from '../../models/user-settings.model';
import { AuthService } from '../auth/auth.service';
import { passwordMatchValidator } from '../auth/password-match-validator';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  accountForm: FormGroup;
  photoForm: FormGroup;
  addressForm: FormGroup;
  profileForm: FormGroup;
  paymentMethodForm: FormGroup;

  userEmail = 'guest.user@gmail.com';
  photoPreview: string | ArrayBuffer | null = null;
  selectedPhoto: File | null = null;
  intitails: string = 'GU';
  fullName: string = 'Guest User';
  showAlert: boolean = false;
  alertMessage: string = '';
  alertType: string = 'success';
  isSocialMediaAccount = false;
  menuItems = [
    'Profile',
    'Photo',
    'Address',
    'Account Security',
    'Subscriptions',
    'Payment methods',
    'Close account',
  ];
  userSettings: UserSettings;
  selectedMenu = 'Profile';

  constructor(
    private fb: FormBuilder,
    private settingsService: SettingsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isSocialMediaAccount =
      localStorage.getItem('isSocialMediaAccount') === 'true';
    this.userEmail =
      JSON.parse(localStorage.getItem('userEmail') ?? '{}') || '';
    this.settingsService.getUser();
    this.settingsService.user$.subscribe((user) => {
      if (user) {
        this.userSettings = user;
        this.userEmail = JSON.parse(localStorage.getItem('userEmail') ?? '{}') || '';
          //JSON.parse(localStorage.getItem('userData') ?? '{}').email || '';
        this.intitails = this.getInitials();
        this.fullName = this.getFullName();
        this.initForm();
      }
    });
    if (!this.userSettings) {
      this.initForm();
    }
  }

  initForm() {
    let photo = '';
    let streetAddress = '';
    let houseNumber = '';
    let city = '';
    let state = '';
    let zipCode = '';
    let country = '';
    let salutation = '';
    let firstName = '';
    let lastName = '';
    let headline = '';
    let biography = '';
    let language = '';
    let phoneNumber = '';
    let website = '';
    let facebookUserName = '';
    let instagramUserName = '';
    let linkedInPublicProfileUrl = '';
    let tiktok = '';
    let twitterUserName = '';
    let youtube = '';
    let preferredPaymentMethod = '';

    if (this.userSettings !== undefined) {
      streetAddress = this.userSettings.streetAddress ?? '';
      houseNumber = this.userSettings.houseNumber ?? '';
      city = this.userSettings.city ?? '';
      state = this.userSettings.state ?? '';
      zipCode = this.userSettings.zipCode ?? '';
      country = this.userSettings.country ?? '';
      salutation = this.userSettings.salutation ?? '';
      firstName = this.userSettings.userFirstName ?? '';
      lastName = this.userSettings.userLastName ?? '';
      headline = this.userSettings.headline ?? '';
      biography = this.userSettings.biography ?? '';
      language = this.userSettings.language ?? '';
      phoneNumber = this.userSettings.phoneNumber ?? '';
      website = this.userSettings.website ?? '';
      facebookUserName = this.userSettings.facebookUserName ?? '';
      instagramUserName = this.userSettings.instagramUserName ?? '';
      linkedInPublicProfileUrl =
        this.userSettings.linkedInPublicProfileUrl ?? '';
      tiktok = this.userSettings.tiktokUserName ?? '';
      twitterUserName = this.userSettings.twitterUserName ?? '';
      youtube = this.userSettings.youtubeUserName ?? '';
      preferredPaymentMethod = this.userSettings.preferredPaymentMethod ?? '';
    }

    this.photoForm = this.fb.group({
      photo: [null, Validators.required],
    });

    this.accountForm = this.fb.group(
      {
        email: new FormControl(this.userEmail),
/*         currentPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required], */
      },
      { validators: passwordMatchValidator }
    );

    this.addressForm = this.fb.group({
      streetAddress: [streetAddress, Validators.required],
      houseNumber: [houseNumber, Validators.required],
      city: [city, Validators.required],
      state: [state, Validators.required],
      ZipCode: [
        zipCode,
        [Validators.required, Validators.pattern(/^\d{4,10}$/)],
      ],
      country: [country, Validators.required],
    });

    this.profileForm = this.fb.group({
      salutation: [salutation, Validators.required],
      userFirstName: [firstName, Validators.required],
      userLastName: [lastName, Validators.required],
      headline: [headline], //, [Validators.maxLength(60)]
      biography: [biography], // , [Validators.maxLength(1000)]
      language: ['en', Validators.required],
      phoneNumber: [phoneNumber],
      website: [website],
      facebookUserName: [facebookUserName],
      instagramUserName: [instagramUserName],
      linkedInPublicProfileUrl: [linkedInPublicProfileUrl],
      tiktokUserName: [tiktok],
      twitterUserName: [twitterUserName],
      youtubeUserName: [youtube],
    });

    this.paymentMethodForm = this.fb.group({
      preferredPaymentMethod: [preferredPaymentMethod],
    });
  }

  selectMenu(item: string) {
    this.selectedMenu = item;
  }

  getInitials() {
    const firstNameChar = this.userSettings?.userFirstName?.charAt(0) || '';
    const lastNameChar = this.userSettings?.userLastName?.charAt(0) || '';
    const initials = firstNameChar + lastNameChar;

    return initials ? initials.toUpperCase() : 'GU';
  }

  getFullName() {
    if (this.userSettings?.userFirstName && this.userSettings?.userLastName) {
      return `${this.userSettings.userFirstName} ${this.userSettings.userLastName}`;
    }
    return 'Guest User';
  }

  onChangePassword() {
    const email = this.accountForm.value.email;
    if (email) {
      this.authService.changePassword(email);
    } else {
      alert('No email found in user session.');
    }
  }

  onChangePasswordSubmit() {
    if (this.accountForm.invalid) {
      this.accountForm.markAllAsTouched();
      return;
    }
    if (this.accountForm.valid) {
      const email = this.accountForm.value.email;
      const currentPassword = this.accountForm.value.currentPassword;
      const newPassword = this.accountForm.value.newPassword;
      this.onChangePassword();
    }
  }

  onCloseAlert() {
    this.showAlert = false;
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  onPhotoSelected(event: Event): void {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) {
      this.selectedPhoto = file;
      this.photoForm.patchValue({ photo: file });
      this.photoForm.get('photo')?.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = () => {
        this.photoPreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onPhotoSubmit(): void {
    if (this.photoForm.valid && this.selectedPhoto) {
      console.log('Photo uploaded:', this.selectedPhoto);
    }
  }

  onAddressSubmit(): void {
    if (this.addressForm.valid) {
      const updatedUser: UserSettings = {
        ...this.userSettings,
        ...this.addressForm.value,
      };
      console.log(' address updatedUser :', updatedUser);
      this.settingsService.updateUser(updatedUser);
            this.showAlert = true;
      this.alertMessage = 'User address saved successfully!';
      this.alertType = 'success';
    }
  }

  onProfileSubmit() {
    if (this.profileForm.valid) {
      const updatedUser: UserSettings = {
        ...this.userSettings,
        ...this.profileForm.value,
      };
      console.log(' profile updatedUser :', updatedUser);
      this.settingsService.updateUser(updatedUser);
      this.showAlert = true;
      this.alertMessage = 'User profile data saved successfully!';
      this.alertType = 'success';
    }
  }

  onAddPaymentMethod() {
    if (this.paymentMethodForm.valid) {
      const updatedUser: UserSettings = {
        ...this.userSettings,
        ...this.paymentMethodForm.value,
      };
      console.log(' paymentMethodForm updatedUser :', updatedUser);
      this.settingsService.updateUser(updatedUser);
      this.showAlert = true;
      this.alertMessage = 'User preffered payment mode saved successfully!';
      this.alertType = 'success';
    }
  }
}
