import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskComponent } from '../components/dialog/add-task/add-task.component';
import { ConfirmDeleteComponent } from '../components/dialog/confirm-delete/confirm-delete.component';
import { ChooseStrategyComponent } from '../components/dialog/choose-strategy/choose-strategy.component';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  listKey: string;

  constructor(public db: AngularFirestore,
              private router: Router,
              private route: ActivatedRoute,
              public dialog: MatDialog) { }

  private openAddTaskDialog(newTask: boolean, task?: string) {
    return this.dialog.open(AddTaskComponent, {
      width: '500px',
      data: {
          newTask,
          task
      }
    });
  }

  private openConfirmDeleteDialog() {
    return this.dialog.open(ConfirmDeleteComponent, {
      width: '200px'
    });
  }

  private openChooseStrategyDialog() {
    return this.dialog.open(ChooseStrategyComponent, {
      width: '400px'
    });
  }

  generateListKey() {
    this.listKey = this.db.createId();
  }

  getList() {
    return this.db.collection('todoLists').doc(this.listKey).collection('todo').snapshotChanges();
  }

  addTask() {
    this.openAddTaskDialog(true).afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.db.collection('todoLists').doc(this.listKey).collection('todo').add({
          task: result,
          complete: false,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        if (!this.route.snapshot.paramMap.has('listKey')) {
          this.router.navigate([`${this.listKey}`]);
        }
      }
    });
  }

  changeTask(taskKey: string, task: string, timestamp: any) {
    const lastModifiedTime = timestamp;
    const docRef = this.db.collection('todoLists').doc(this.listKey).collection('todo').doc(taskKey);

    this.openAddTaskDialog(false, task).afterClosed().subscribe(result => {
      if (result !== undefined) {
        const newTask = result;
        docRef.get().subscribe(doc => {
          if (doc.exists) {
            if (!lastModifiedTime.isEqual(doc.data().timestamp)) {
              this.openChooseStrategyDialog().afterClosed().subscribe(result => {
                switch (result) {
                  case 'new': {
                      this.db.collection('todoLists').doc(this.listKey).collection('todo').add({
                        task: newTask,
                        complete: false,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp()
                      });
                      break;
                  }
                  case 'overwrite': {
                    docRef.update({
                      task: newTask,
                      complete: false,
                      timestamp: firebase.firestore.FieldValue.serverTimestamp()
                    });
                    break;
                  }
                }
              });
            } else {
              docRef.update({
                task: newTask,
                complete: false,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
              });
            }
          } else {
            this.db.collection('todoLists').doc(this.listKey).collection('todo').doc(taskKey).set({
              task: result,
              complete: false,
              timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
          }
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
    this.openConfirmDeleteDialog().afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.db.collection('todoLists').doc(this.listKey).collection('todo').doc(taskKey).delete();
      }
    });
  }
}
