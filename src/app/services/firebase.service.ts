import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskComponent } from '../components/add-task/add-task.component';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  listKey: string;

  constructor(public db: AngularFirestore, private router: Router, private route: ActivatedRoute, public dialog: MatDialog) { }

  private openDialog(newTask: boolean, task?: string) {
    return this.dialog.open(AddTaskComponent, {
      width: '500px',
      data: {
          newTask,
          task
      }
    });
  }

  generateListKey() {
    this.listKey = this.db.createId();
  }

  getList() {
    return this.db.collection('todoLists').doc(this.listKey).collection('todo').snapshotChanges();
  }

  addTask() {
   /*  this.db.collection('userLists').add({
      name: 'todo'
    }); */

    // const ref =  this.db.collection('todoLists').add({});
    // const id = this.db.createId();
    // const ref = this.db.collection('todoLists').doc(id);
   /* this.db.collection('todoLists').doc(id).collection('todo').add({
      task: 'Почистить зубы',
      complete: false
    });*/
    // console.log(ref);
    this.openDialog(true).afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.db.collection('todoLists').doc(this.listKey).collection('todo').add({
          task: result,
          complete: false
        });

        if (!this.route.snapshot.paramMap.has('listKey')) {
          this.router.navigate([`#${this.listKey}`]);
        }
      }
    });
    /*this.db.collection('todoLists').doc(this.listKey).collection('todo').add({
      task,
      complete: false
    });*/
  }

  changeTask(taskKey: string, task: string) {
    /*this.db.collection('todoLists').doc(this.listKey).collection('todo').doc(taskKey).update({
      task
    });*/

    this.openDialog(false, task).afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.db.collection('todoLists').doc(this.listKey).collection('todo').doc(taskKey).update({
          task: result
        });
      }
    });
  }

  changeTaskStatus(taskKey: string, complete: boolean) {
    this.db.collection('todoLists').doc(this.listKey).collection('todo').doc(taskKey).update({
      complete
    });
  }

  deleteTask(taskKey: string) {
    this.db.collection('todoLists').doc(this.listKey).collection('todo').doc(taskKey).delete();
  }
}
