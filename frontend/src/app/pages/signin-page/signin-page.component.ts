import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core'
import { AuthService } from 'src/app/auth.service';


@Component({
    selector: 'app-signin-page',
    templateUrl: './signin-page.component.html',
    styleUrls: ['./signin-page.component.scss']
})
export class SigninPageComponent implements OnInit {
    constructor(private authService: AuthService) {}

    ngOnInit() {}

    onSigninButtonClicked(email: string, password: string) {
        this.authService.signin(email, password).subscribe((response: HttpResponse<any>) => {
            console.log(response)
        })
    }
}

