import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { ToDo } from '../../model/todo.interface';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {
  /** Массив, хранящий список TODO  */
  todoList: ToDo[];

  /**
   * Конструктор
   * @param firebaseService - объект службы, реализующей работу с сервером firestore
   * @param route - объект для работы с маршрутами
   */
  constructor(private firebaseService: FirebaseService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    // Подписываемся на отслеживание изменений параметра(значение ключа списка), передаваемого в составе маршрута
    this.route.params.subscribe(
      (params) => {
        // Если идентификатор списка присутствует, то получаем этот список
        if (params.listKey) {
          this.firebaseService.setInitial(params.listKey);
          this.firebaseService.getList().subscribe(result => {
            this.todoList = result;
          });
        } else { // Если идентификатора списка нет, то нужно создать список. Для этого генерируем идентификатор.
          this.firebaseService.generateListKey();
        }
    });
  }

  /**
   * Добавляет новую задачу в список
   */
  createTask() {
    this.firebaseService.createTask();
  }

  /**
   * Удаляет выбранную задачу из списка
   * @param todo - зачада, которую нужно удалить из списка
   */
  deleteTask(todo: ToDo) {
    this.firebaseService.deleteTask(todo.id);
  }

  /**
   * Изменяет формулировку(текст) выбранной задачи
   * @param todo - задача, текст которой нужно изменить
   */
  editTask(todo: ToDo) {
    this.firebaseService.editTask(todo.id, todo.text, todo.timestamp);
  }

  /**
   * Меняет статус(выполнено/не выполнено) выбранной задачи
   * @param todo - выбранная задача, статус которой нужно изменить
   * @param complete - статус задачи
   */
  changeTaskStatus(todo: ToDo, complete: boolean) {
    this.firebaseService.changeTaskStatus(todo.id, complete);
  }
}
