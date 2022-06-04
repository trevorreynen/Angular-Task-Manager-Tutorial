import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { TaskViewComponent } from './pages/task-view/task-view.component'
import { NewListComponent } from './pages/new-list/new-list.component'
import { NewTaskComponent } from './pages/new-task/new-task.component'
import { SigninPageComponent } from './pages/signin-page/signin-page.component'
import { SignupPageComponent } from './pages/signup-page/signup-page.component'
import { EditListComponent } from './pages/edit-list/edit-list.component'
import { EditTaskComponent } from './pages/edit-task/edit-task.component'


const routes: Routes = [
    { path: '', redirectTo: 'lists', pathMatch: 'full' },
    { path: 'lists', component: TaskViewComponent },
    { path: 'lists/:listId', component: TaskViewComponent },
    { path: 'lists/:listId/new-task', component: NewTaskComponent },
    { path: 'lists/:listId/edit-task/:taskId', component: EditTaskComponent },
    { path: 'new-list', component: NewListComponent },
    { path: 'edit-list/:listId', component: EditListComponent },
    { path: 'signin', component: SigninPageComponent },
    { path: 'signup', component: SignupPageComponent },
    /* { path: '', component: }, */
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}

