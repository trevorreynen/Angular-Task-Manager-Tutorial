import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { TaskService } from 'src/app/task.service'


@Component({
    selector: 'app-new-list',
    templateUrl: './new-list.component.html',
    styleUrls: ['./new-list.component.scss']
})
export class NewListComponent implements OnInit {
    constructor(private taskService: TaskService, private router: Router) {}

    ngOnInit() {}

    createList(title: string) {
        this.taskService.createList(title).subscribe((response: any) => {
            //console.log(response) // Shows an object of the list created after clicking create in the console. Will show title of list, and _id.
            // Now we navigate to /lists/response._id
            this.router.navigate(['/lists', response._id])
        })
    }
}

