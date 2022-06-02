import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { shareReplay, tap } from 'rxjs/operators'
import { WebRequestService } from './web-request.service'


@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private webService: WebRequestService, private router: Router, private http: HttpClient) {}

    signin(email: string, password: string) {
        return this.webService.signin(email, password).pipe(
            shareReplay(),
            tap((response: HttpResponse<any>) => {
                // The auth tokens will be in the header of this response.
                this.setSession(response.body._id, response.headers.get('x-access-token')!, response.headers.get('x-refresh-token')!)
            })
        )
    }

    signout() {
        this.removeSession()

        this.router.navigate(['/signin'])
    }

    setAccessToken(accessToken: string) {
        localStorage.setItem('x-access-token', accessToken)
    }

    getAccessToken() {
        return localStorage.getItem('x-access-token')
    }

    setRefreshToken(refreshToken: string) {
        localStorage.setItem('x-refresh-token', refreshToken)
    }

    getRefreshToken() {
        return localStorage.getItem('x-refresh-token')
    }

    getUserId() {
        return localStorage.getItem('user-id')
    }

    private setSession(userId: string, accessToken: string, refreshToken: string) {
        localStorage.setItem('user-id', userId)
        localStorage.setItem('x-access-token', accessToken)
        localStorage.setItem('x-refresh-token', refreshToken)
    }

    private removeSession() {
        localStorage.removeItem('user-id')
        localStorage.removeItem('x-access-token')
        localStorage.removeItem('x-refresh-token')
    }

    getNewAccessToken() {
        return this.http
            .get(`${this.webService.ROOT_URL}/users/me/access-token`, {
                headers: {
                    'x-refresh-token': this.getRefreshToken()!,
                    _id: this.getUserId()!
                },
                observe: 'response'
            })
            .pipe(
                tap((response: HttpResponse<any>) => {
                    return this.setAccessToken(response.headers.get('x-access-token')!)
                })
            )
    }
}

