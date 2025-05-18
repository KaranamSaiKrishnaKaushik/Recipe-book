import {Component, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, NgForm, Validators} from "@angular/forms";
import {AuthService} from "./auth.service";
import {endWith, Observable} from "rxjs";
import {Router} from "@angular/router";
import { UserCredential } from 'firebase/auth';
import { passwordMatchValidator } from './password-match-validator';
import { UserSettings } from '../../models/user-settings.model';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})

export class AuthComponent implements OnInit{
  @ViewChild('authForm') aForm: NgForm;
  isLoginMode = true;
  isLoading = false;
  error: string;
  authForm: FormGroup;
  userSettings: UserSettings;
  constructor(private authService: AuthService,
    private router: Router) {
}
  onSwitchMode(){
    this.isLoginMode = !this.isLoginMode;
    //this.error = null;
  }

  onSubmit(form: NgForm){
    if(!form.valid){
      return;
    }

    this.isLoading= true;
    document.activeElement instanceof HTMLElement && document.activeElement.blur();
    const email = form.value.email;
    const password =  form.value.password;
    const confirmPassword =  form.value.confirmPassword;

    let authObservable: Observable<UserCredential>;
    if(this.isLoginMode){
      authObservable = this.authService.login(email, password);
    }else{
      const updatedUser: UserSettings = {
        userFirstName : form.value.firstName,
        userLastName : form.value.lastName
      };
      
      console.log('userSettings :', updatedUser);
      if (password !== confirmPassword) {
        this.error = 'Passwords do not match!';
        return;
      }
      authObservable = this.authService.signUp(email, password, updatedUser);
    }

    authObservable.subscribe(
      resData=>{
        console.log(resData);
        this.isLoading = false;
        this.router.navigate(['recipes'])

      }, errorMessage=>{
        setTimeout(() => {
          this.error = errorMessage;
          this.isLoading = false;
        }, 1000);
      });

   form.reset();
  }

  passwordsMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const form = control as FormGroup;
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
  
    if (password && confirmPassword && password !== confirmPassword) {
      return { mismatch: true };
    }
  
    return null;
  }

  ngOnInit(): void {
    this.authForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    }, this.passwordsMatchValidator); 

    setTimeout(() => {
      if (this.aForm) {
        this.aForm.setValue({
          email: 'test@test.com',
          password: 'Boston100$'
        });
      }
    }, 500);
  }


}
