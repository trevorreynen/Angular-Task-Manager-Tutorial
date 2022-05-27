import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Params } from '@angular/router'
import { TaskService } from 'src/app/task.service'
import { Task } from 'src/app/models/task.model'
import { List } from 'src/app/models/list.model'


@Component({
    selector: 'app-task-view',
    templateUrl: './task-view.component.html',
    styleUrls: ['./task-view.component.scss']
})
export class TaskViewComponent implements OnInit {
    lists!: List[]
    tasks!: Task[]

    constructor(private taskService: TaskService, private route: ActivatedRoute) {}

    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            if (params['listId']) {
                this.taskService.getTasks(params['listId']).subscribe((tasks: any) => {
                    this.tasks = tasks
                })
            } else {
                this.tasks = undefined!
            }
        })

        this.taskService.getLists().subscribe((lists: any) => {
            //console.log(lists) // Shows object of all lists on the "homepage" in the console.
            this.lists = lists
        })
    }

    // Sets a task to completed.
    onTaskClick(task: Task) {
        this.taskService.completed(task).subscribe(() => {
            // Task has been set to completed successfully.
            //console.log('Completed successfully') // This will appear in console when clicking on a task to mark it as completed
            task.completed = !task.completed
        })
    }
}

