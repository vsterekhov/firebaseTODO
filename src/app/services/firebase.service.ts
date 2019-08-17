import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(public db: AngularFirestore) { }

  addTODO() {
   /*  this.db.collection('userLists').add({
      name: 'todo'
    }); */

    // const ref =  this.db.collection('todoLists').add({});
    const id = this.db.createId();
    // const ref = this.db.collection('todoLists').doc(id);
    this.db.collection('todoLists').doc(id).collection('todo').add({
      task: 'Почистить зубы',
      complete: false
    });
    // console.log(ref);
  }

  getList() {
    return this.db.collection('todoLists').doc('5Gnf18yMhnjYZbw74PQo').collection('todo').snapshotChanges();
  }
}
