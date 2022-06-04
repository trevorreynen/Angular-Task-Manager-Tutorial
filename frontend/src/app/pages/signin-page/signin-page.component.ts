import { HttpResponse } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { AuthService } from 'src/app/auth.service'


@Component({
    selector: 'app-signin-page',
    templateUrl: './signin-page.component.html',
    styleUrls: ['./signin-page.component.scss']
})
export class SigninPageComponent implements OnInit {
    constructor(private authService: AuthService, private router: Router) {}

    ngOnInit() {}

    onSigninButtonClicked(email: string, password: string) {
        this.authService.signin(email, password).subscribe((response: HttpResponse<any>) => {
            if (response.status === 200) {
                // Signed in successfully.
                this.router.navigate(['/lists'])
            }

            //console.log(response) // Shows response in console after clicking the Sign In button.
        })
    }
}

