import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

export interface DialogData {
  action: string;
}

@Component({
  selector: 'app-choose-strategy',
  templateUrl: './choose-strategy.component.html',
  styleUrls: ['./choose-strategy.component.scss']
})
export class ChooseStrategyComponent {

  constructor(public dialogRef: MatDialogRef<ChooseStrategyComponent>) { }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(action: string): void {
    this.dialogRef.close(action);
  }
}
