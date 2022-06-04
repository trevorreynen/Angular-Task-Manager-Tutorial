import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { catchError, empty, Observable, Subject, switchMap, tap, throwError } from 'rxjs'
import { AuthService } from './auth.service'


@Injectable({
    providedIn: 'root'
})
export class WebReqInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) {}

    refreshingAccessToken!: boolean

    accessTokenRefreshed: Subject<any> = new Subject()

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
        // Handle the request.
        request = this.addAuthHeader(request)

        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                console.log(error)

                if (error.status === 401) {
                    // 401 error means we are unauthorized.

                    // Refresh the access token.
                    return this.refreshAccessToken().pipe(
                        switchMap(() => {
                            request = this.addAuthHeader(request)

                            return next.handle(request)
                        }),
                        catchError((error: any) => {
                            console.log(error)
                            this.authService.signout()

                            return empty()
                        })
                    )
                }

                return throwError(error)
            })
        )
    }

    refreshAccessToken() {
        if (this.refreshingAccessToken) {
            return new Observable((observer) => {
                this.accessTokenRefreshed.subscribe(() => {
                    // This will run when the access token has been refreshed.
                    observer.next()
                    observer.complete()
                })
            })
        } else {
            this.refreshingAccessToken = true

            // Call a method in the auth service to send a request to refresh the access token.
            return this.authService
                .getNewAccessToken()
                .pipe(
                    tap(() => {
                        console.log('Access Token Refreshed')

                        this.refreshingAccessToken = false
                        this.accessTokenRefreshed
                    })
                )
        }
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

