import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

/** Определяет действия при обнаружении параллельных изменений во время редактирования задачи */
export const enum Strategy {New, Overwrite}

@Component({
  selector: 'app-choose-strategy',
  templateUrl: './choose-strategy.component.html',
  styleUrls: ['./choose-strategy.component.scss']
})
export class ChooseStrategyComponent {
  /** Определяет действие: создать новую задачу */
  new: Strategy = Strategy.New;

  /** Определяет действие: перезаписать текущую задачу */
  overwrite: Strategy = Strategy.Overwrite;

  constructor(public dialogRef: MatDialogRef<ChooseStrategyComponent>) { }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(strategy: Strategy): void {
    this.dialogRef.close(strategy);
  }
}
