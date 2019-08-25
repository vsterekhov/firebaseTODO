import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection  } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskComponent } from '../components/dialog/add-task/add-task.component';
import { ConfirmDeleteComponent } from '../components/dialog/confirm-delete/confirm-delete.component';
import { ChooseStrategyComponent, Strategy } from '../components/dialog/choose-strategy/choose-strategy.component';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { Timestamp } from '@firebase/firestore-types';
import { ToDo } from '../model/todo.interface';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  /** Ключ, идентифицирующий список TODO в firestore */
  private listKey: string;

  /** Ссылка на список TODO */
  private listRef: AngularFirestoreCollection;

  /**
   *
   * @param db - объект для работы с сервером firestore
   * @param dialog - объект для работы с диалоговыми окнами
   */
  constructor(private db: AngularFirestore,
              private dialog: MatDialog) { }

  /**
   * Создаёт ссылку на список по полученному идентификатору
   * @param listKey - идентификатор списка
   */
  setInitial(listKey: string) {
    this.listKey = listKey;
    this.listRef = this.db.collection('todoLists').doc(this.listKey).collection('todo');
  }

  /**
   * Генерирует уникальный ключ для идентификации списка TODO
   */
  generateListKey(): string {
    return this.db.createId();
  }

  /**
   * Возвращает observable, который в реальном времени эмитит данные при каждом изменени списка TODO на сервере
   */
  getList(): Observable<ToDo[]> {
    return this.listRef.snapshotChanges()
    .pipe(
      map(list => list.map(item => {
        const data = item.payload.doc.data() as ToDo;
        const id = item.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  /**
   * Создает новую задачу в списке
   */
  createTask() {
    this.openAddTaskDialog().afterClosed().subscribe(result => {
      if (result) {
        this.addTask(result);
      }
    });
  }

  /**
   * Редактирует выбранную задачу
   * @param id - идентификатор задачи
   * @param text - текст задачи
   * @param timestamp - дата последнего изменения задачи
   */
  editTask(id: string, text: string, timestamp: Timestamp) {
    // Запоминаем последнее время изменения задачи перед началом редактирования
    const lastModifiedTime: Timestamp = timestamp;

    this.openAddTaskDialog(text).afterClosed().subscribe(result => {
      if (result) {
        // Запоминаем новый текст задачи
        const newText = result;

        this.listRef.doc(id).get().subscribe(doc => {
          // Проверяем не была ли удалена задача кем-то другим во время редактирования
          if (doc.exists) {
            // Проверям вносил ли кто-либо другой изменения пока было открыто диалоговое окно редактирования
            if ( !lastModifiedTime.isEqual(doc.data().timestamp) ) {

              // Открываем диалоговое окно выбора дальнейших действий
              this.openChooseStrategyDialog().afterClosed().subscribe(strategy => {
                switch (strategy) {
                  case Strategy.New:
                      this.addTask(newText);
                      break;
                  case Strategy.Overwrite:
                    this.setTask(newText, id);
                    break;
                }
              });

            } else { // Если никто не вносил изменения пока было открыто диалоговое окно редактирования задачи, то просто перезаписываем её
              this.setTask(newText, id);
            }

          } else { // Если задача была удалена, то пересоздаём её с введённым текстом
            this.setTask(newText, id);
          }
        });

      }
    });
  }

  /**
   * Меняет статус задачи
   * @param id - идентификатор задачи
   * @param complete - статус задачи
   */
  changeTaskStatus(id: string, complete: boolean) {
    this.listRef.doc(id).update({
      complete
    });
  }

  /**
   * Удаляет выбранную задачу из списка
   * @param id - идентификатор задачи
   */
  deleteTask(id: string) {
    this.openConfirmDeleteDialog().afterClosed().subscribe(result => {
      if (result) {
        this.listRef.doc(id).delete();
      }
    });
  }

  /**
   * Добавляет новую задачу в список TODO, хранящийся в firestore
   * @param text - текст задачи
   */
  private addTask(text: string) {
    this.listRef.add({
      text,
      complete: false,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
  }

  /**
   * Перезаписывает выбранную задачу в списке TODO, хранящемся в firestore (при изменеии статус задачи выставляется в "не выполнено")
   * @param text - текст задачи
   * @param id - идентификатор задачи
   */
  private setTask(text: string, id: string) {
    this.listRef.doc(id).set({
      text,
      complete: false,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
  }

  /**
   * Открывает диалоговое окно создания/редактированя задачи.
   * @param text - текст задачи(передаётся в случае редактирования)
   */
  private openAddTaskDialog(text?: string) {
    return this.dialog.open(AddTaskComponent, {
      width: '500px',
      data: {
          text
      }
    });
  }

  /**
   * Открывает диалоговое окно подтверждения удаления выбранной задачи
   */
  private openConfirmDeleteDialog() {
    return this.dialog.open(ConfirmDeleteComponent, {
      width: '200px'
    });
  }

  /**
   * Открывает диалоговое окно выбора дальнейших действий после редактирования, при обнаружении изменений, внесённых другим пользователем.
   */
  private openChooseStrategyDialog() {
    return this.dialog.open(ChooseStrategyComponent, {
      width: '500px'
    });
  }
}
