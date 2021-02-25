import { Injectable } from '@angular/core';
import { Task } from './models/task.model';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private webReqService: WebRequestService) { }

  createList(title: String) {
    // We want to send a request to create a list.
    return this.webReqService.post('lists', { title });
  }

  getLists() {
    return this.webReqService.get('lists');
  }

  createTask(title: String, listId: String) {
    // We want to send a request to create a task.
    return this.webReqService.post(`lists/${listId}/tasks`, { title });
  }

  getTasks(listId: String) {
    return this.webReqService.get(`lists/${listId}/tasks`);
  }

  complete(task: Task) {
    return this.webReqService.patch(`lists/${task._listId}/tasks/${task._id}`, {
      completed: !task.completed
    });
  }
}
