import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-new-list',
  templateUrl: './new-list.component.html',
  styleUrls: ['./new-list.component.scss']
})
export class NewListComponent implements OnInit {

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
  }

  creatList(title: String) {
    this.taskService.createList(title).subscribe((response: any) => {
      console.log(response);
      // Navigating to /lists/response.id
    });
  }

}
