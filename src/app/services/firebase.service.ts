import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  // tslint:disable-next-line:variable-name
  listKey: string;

  constructor(public db: AngularFirestore) { }

  generateListKey() {
    this.listKey = this.db.createId();
  }

  getList() {
    return this.db.collection('todoLists').doc(this.listKey).collection('todo').snapshotChanges();
  }

  addTask(task: string) {
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

    this.db.collection('todoLists').doc(this.listKey).collection('todo').add({
      task,
      complete: false
    });
  }

  editTask(taskKey: string) {

  }

  deleteTask(taskKey: string) {

  }
}
