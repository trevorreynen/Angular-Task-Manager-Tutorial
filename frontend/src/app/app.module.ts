import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { HttpClientModule } from '@angular/common/http'

import { TaskViewComponent } from './pages/task-view/task-view.component'
import { NewListComponent } from './pages/new-list/new-list.component'


@NgModule({
    declarations: [
        AppComponent,
        TaskViewComponent,
        NewListComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}

