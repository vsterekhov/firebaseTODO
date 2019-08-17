import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {

  constructor(private firebaseService: FirebaseService, private route: ActivatedRoute) { }

  ngOnInit() {
   /* if (this.route.snapshot.paramMap.has('listKey')) {
      console.log(this.route.snapshot.params.listKey);
    } else {
      console.log('no param');
    }*/
    // this.firebaseService.addTODO();
    this.firebaseService.getList()
    .subscribe(result => {
      console.log(result);
      console.log(result[0].payload.doc.data());
    });
  }

}
