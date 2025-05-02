import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthResponseData, AuthService} from "./auth.service";
import {endWith, Observable} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})

export class AuthComponent implements OnInit{
  @ViewChild('authForm') aForm: NgForm;
  constructor(private authService: AuthService,
              private router: Router) {
  }
  isLoginMode = true;
  isLoading = false;
  error : string;
  onSwitchMode(){
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm){
    if(!form.valid){
      return;
    }
    this.isLoading= true;
    document.activeElement instanceof HTMLElement && document.activeElement.blur();
    const email = form.value.email;
    const password =  form.value.password;

    let authObservable: Observable<AuthResponseData>;
    if(this.isLoginMode){
      authObservable = this.authService.login(email, password);
    }else{
      authObservable = this.authService.signUp(email, password);
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

  ngOnInit(): void {
    setTimeout(() => {
      if (this.aForm) {
        this.aForm.setValue({
          email: 'test@test.com',
          password: '123456'
        });
      }
    }, 500);
  }
}
