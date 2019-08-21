import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskComponent } from '../add-task/add-task.component';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {
  todoList: Array<any>;

  constructor(private firebaseService: FirebaseService,
              private route: ActivatedRoute,
              private router: Router,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params) => {
        if (params.listKey !== undefined) {

          if (params.listKey.startsWith('#')) {
            this.firebaseService.listKey = params.listKey.slice(1);
            this.firebaseService.getList()
            .subscribe(result => {
              this.todoList = result; console.log(this.todoList[0].payload.doc.id);
            });
          }
        } else {
          this.firebaseService.generateListKey();
        }
    });
  }

  openDialog(): void {
   /* const dialogRef = this.dialog.open(AddTaskComponent, {
        width: '500px',
        data: {task: undefined}
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.firebaseService.addTask(result);
        if (!this.route.snapshot.paramMap.has('listKey')) {
          this.router.navigate([`${this.firebaseService.listKey}`]);
        }
      }
    });*/
  }

  addTask() {
    this.firebaseService.addTask();
  }

  editTask(task: any) {
    /*const dialogRef = this.dialog.open(AddTaskComponent, {
      width: '500px',
      data: { task: task.payload.doc.data().task }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.firebaseService.changeTask(task.payload.doc.id, result);
        this.firebaseService.changeTaskStatus(task.payload.doc.id, false);
      }
    });*/
    this.firebaseService.changeTask(task.payload.doc.id, task.payload.doc.data().task);
  }

  deleteTask(task: any) {
    this.firebaseService.deleteTask(task.payload.doc.id);
  }

  onChange(event: any, task: any) {
    this.firebaseService.changeTaskStatus(task.payload.doc.id, event.checked);
  }
}
