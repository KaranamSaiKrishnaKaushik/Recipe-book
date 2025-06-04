import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpParams, HttpRequest} from "@angular/common/http";
import {from, Observable} from "rxjs";
import {AuthService} from "./auth.service";
import {exhaustMap, filter, take} from "rxjs/operators";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor{
  constructor(private authService: AuthService) {
  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  return this.authService.user.pipe(
    take(1),
    filter(user => !!user),
    exhaustMap(user =>
      from(this.authService.getToken()).pipe(
        exhaustMap(token => {
          const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
          const modifiedRequest = req.clone({ headers });
          return next.handle(modifiedRequest);
        })
      )
    )
  );
}
}
