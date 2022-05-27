import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { HttpClientModule } from '@angular/common/http'

import { TaskViewComponent } from './pages/task-view/task-view.component'
import { NewListComponent } from './pages/new-list/new-list.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NewTaskComponent } from './pages/new-task/new-task.component'


@NgModule({
    declarations: [
        AppComponent,
        TaskViewComponent,
        NewListComponent,
        NewTaskComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FontAwesomeModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}

