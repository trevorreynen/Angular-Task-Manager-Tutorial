import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Params } from '@angular/router'
import { TaskService } from 'src/app/task.service'
import { faPlus } from '@fortawesome/free-solid-svg-icons'


@Component({
    selector: 'app-task-view',
    templateUrl: './task-view.component.html',
    styleUrls: ['./task-view.component.scss']
})
export class TaskViewComponent implements OnInit {
    faPlus = faPlus // Imports faPlus icon for task-view.component.html.

    lists: any
    tasks: any

    constructor(private taskService: TaskService, private route: ActivatedRoute) {}

    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            if (params['listId']) {
                this.taskService.getTasks(params['listId']).subscribe((tasks: any) => {
                    this.tasks = tasks
                })
            } else {
                this.tasks = undefined
            }
        })

        this.taskService.getLists().subscribe((lists: any) => {
            //console.log(lists) // Shows object of all lists on the "homepage" in the console.
            this.lists = lists
        })
    }
}

