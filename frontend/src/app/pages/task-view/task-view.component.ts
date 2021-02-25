import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { List } from 'src/app/models/list.model';
import { Task } from 'src/app/models/task.model';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss']
})
export class TaskViewComponent implements OnInit {

  lists: List[] = [];
  tasks: Task[] = [];

  constructor(private taskService: TaskService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.taskService.getTasks(params.listId).subscribe((tasks: any) => {
          this.tasks = tasks;
        })
      }

    )

    this.taskService.getLists().subscribe((lists: any) => {
      this.lists = lists;
    })

  }

  onTaskClick(task: Task) {
    // Setting the task to 'completed'.
    this.taskService.complete(task).subscribe(() => {
      // Task has been set to completed successfully
      console.log("Completed Successfully.");
      task.completed = !task.completed;
    })
  }

}
