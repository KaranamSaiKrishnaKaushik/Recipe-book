import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpParams, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {AuthService} from "./auth.service";
import {exhaustMap, filter, take} from "rxjs/operators";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor{
  constructor(private authService: AuthService) {
  }
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.user.pipe(
      take(1),
      exhaustMap(user => {
        if(!user){
          return next.handle(req);
        }
        const token = this.authService.getAuthToken();
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        const modifiedRequest = req.clone({
          params: new HttpParams().set('auth', user.token!)
          , headers
        })
        return next.handle(modifiedRequest);
      }));
  }
}
