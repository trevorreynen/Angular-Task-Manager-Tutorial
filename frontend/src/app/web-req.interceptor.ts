import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { catchError, Observable, throwError } from 'rxjs'
import { AuthService } from './auth.service'


@Injectable({
    providedIn: 'root'
})
export class WebReqInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
        // Handle the request.
        request = this.addAuthHeader(request)

        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                console.log(error)

                return throwError(error)
            })
        )
    }

    addAuthHeader(request: HttpRequest<any>) {
        // Get the access token.
        const token = this.authService.getAccessToken()

        // Append the access token to the request header.
        if (token) {
            return request.clone({
                setHeaders: {
                    'x-access-token': token
                }
            })
        }

        return request
    }
}

