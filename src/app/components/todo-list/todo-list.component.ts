import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {
  todoList: Array<any>;

  constructor(private firebaseService: FirebaseService,
              private route: ActivatedRoute,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params) => {
        if (params.listKey !== undefined) {
          this.firebaseService.listKey = params.listKey;
          this.firebaseService.getList()
          .subscribe(result => {
            this.todoList = result;
          });
        } else {
          this.firebaseService.generateListKey();
        }
    });
  }

  addTask() {
    this.firebaseService.addTask();
  }

  editTask(task: any) {
    this.firebaseService.changeTask(task.payload.doc.id, task.payload.doc.data().task, task.payload.doc.data().timestamp);
  }

  deleteTask(task: any) {
    this.firebaseService.deleteTask(task.payload.doc.id);
  }

  onChange(event: any, task: any) {
    this.firebaseService.changeTaskStatus(task.payload.doc.id, event.checked);
  }
}
