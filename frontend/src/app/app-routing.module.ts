import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { TaskViewComponent } from './pages/task-view/task-view.component'
import { NewListComponent } from './pages/new-list/new-list.component'


const routes: Routes = [
    { path: '', redirectTo: 'lists', pathMatch: 'full' },
    { path: 'lists', component: TaskViewComponent },
    { path: 'lists/:listId', component: TaskViewComponent },
    { path: 'new-list', component: NewListComponent },
    /* { path: '', component: }, */
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}

