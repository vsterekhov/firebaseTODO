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
    const ref = this.db.collection('todoLists').doc(id);
   /* this.db.collection('todoLists').doc(id).collection('todo').add({
      name: 'todo1'
    });*/
    console.log(ref);
  }
}
