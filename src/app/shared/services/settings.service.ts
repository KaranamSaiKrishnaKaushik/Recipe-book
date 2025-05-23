import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { UserSettings } from "../models/user-settings.model";
import { Injectable } from "@angular/core";
import { catchError } from "rxjs/operators";
import { BehaviorSubject, Observable, throwError } from "rxjs";

@Injectable()
export class SettingsService {

    private userSubject = new BehaviorSubject<UserSettings | null>(null);
    user$: Observable<UserSettings | null> = this.userSubject.asObservable();
    constructor(private httpClient: HttpClient){
    }

    url = environment.apiUrl;

    addUser(userDetails: UserSettings){
    this.httpClient
    .post(this.url+'add-user', userDetails)
    .subscribe(
       response=>{
        console.log(response);
       }
    );
    }

    updateUser(userDetails: UserSettings){
    this.httpClient
    .put(this.url+'update-user', userDetails)
    .subscribe(
       response=>{
        console.log(response);
       }
    );
    }

    getUser(){
        this.httpClient
        .get(this.url+'get-user')
        .pipe(
            catchError(error => {
              if (error.status === 404) {
                console.error('User not found (404)');
              } else {
                console.error('An error occurred:', error);
              }
              return throwError(() => error);
            })
          )
        .subscribe(
           user=>{
            console.log(user);
            const userInstance = UserSettings.fromObject(user);
            this.userSubject.next(userInstance);
           }
        );
    }

    get user(): UserSettings | null {
        return this.userSubject.value;
      }
}