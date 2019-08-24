import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData {
  text: string;
}

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent implements OnInit {
  /** Определяет для чего был вызван диалог: для редактирования выбранной задачи или для создания новой */
  isEdit: boolean;

  constructor(
    public dialogRef: MatDialogRef<AddTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {
    if (this.data.text) {
      this.isEdit = true;
    }
  }
  onCancel(): void {
    this.dialogRef.close();
  }

}
