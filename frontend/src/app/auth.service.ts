import { HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { shareReplay, tap } from 'rxjs/operators'
import { WebRequestService } from './web-request.service'


@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private webService: WebRequestService, private router: Router) {}

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
    }

    setAccessToken(accessToken: string) {
        localStorage.setItem('access-token', accessToken)
    }

    getAccessToken() {
        return localStorage.getItem('x-access-item')
    }

    setRefreshToken(refreshToken: string) {
        localStorage.setItem('refresh-token', refreshToken)
    }

    getRefreshToken() {
        return localStorage.getItem('x-refresh-token')
    }

    private setSession(userId: string, accessToken: string, refreshToken: string) {
        localStorage.setItem('user-id', userId)
        localStorage.setItem('access-token', accessToken)
        localStorage.setItem('refresh-token', refreshToken)
    }

    private removeSession() {
        localStorage.removeItem('user-id')
        localStorage.removeItem('access-token')
        localStorage.removeItem('refresh-token')
    }
}

