import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Params, Router } from '@angular/router'
import { TaskService } from 'src/app/task.service'
import { Task } from 'src/app/models/task.model'
import { List } from 'src/app/models/list.model'


@Component({
    selector: 'app-task-view',
    templateUrl: './task-view.component.html',
    styleUrls: ['./task-view.component.scss']
})
export class TaskViewComponent implements OnInit {
    constructor(private taskService: TaskService, private route: ActivatedRoute, private router: Router) {}

    lists!: List[]
    tasks!: Task[]

    selectedListId!: string

    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            if (params['listId']) {
                this.selectedListId = params['listId']
                this.taskService.getTasks(params['listId']).subscribe((tasks: any) => {
                    this.tasks = tasks
                })
            } else {
                this.tasks = undefined!
            }
        })

        this.taskService.getLists().subscribe((lists: any) => {
            this.lists = lists
            //console.log(lists) // Shows object of all lists on the "homepage" in the console.
        })
    }

    // Sets a task to completed.
    onTaskClick(task: Task) {
        this.taskService.completed(task).subscribe(() => {
            task.completed = !task.completed
            //console.log('Completed successfully') // This will appear in console when clicking on a task to mark it as completed.
        })
    }

    onDeleteListClick() {
        this.taskService.deleteList(this.selectedListId).subscribe((response: any) => {
            this.router.navigate(['/lists'])
            //console.log(response) // Shows response in console after clicking delete list button.
        })
    }

    onDeleteTaskClick(id: string) {
        this.taskService.deleteTask(this.selectedListId, id).subscribe((response: any) => {
            this.tasks = this.tasks.filter((val: { _id: string }) => val._id !== id)
            //console.log(response) // Shows response in console after clicking delete task button.
        })
    }
}

