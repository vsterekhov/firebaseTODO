import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  task: string;
  private listKey: string;

  constructor(private firebaseService: FirebaseService, private route: ActivatedRoute, public dialog: MatDialog) { }

  ngOnInit() {
    if (this.route.snapshot.paramMap.has('listKey')) {
      this.firebaseService.getList(this.route.snapshot.params.listKey)
      .subscribe(result => {
        this.todoList = result;
      });
    } else {
      this.listKey = this.firebaseService.generateListKey();
    }
    // this.firebaseService.addTODO();
   /*  this.firebaseService.getList()
    .subscribe(result => {
      console.log(result);
      console.log(result[0].payload.doc.data());
    }); */
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddTaskComponent, {
        width: '500px',
        data: {task: this.task}
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.firebaseService.addTask(this.listKey, result);
      }
    });
  }
}
