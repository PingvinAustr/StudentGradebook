import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslationService } from 'src/app/services/translation/translation-service.service';

@Component({
  selector: 'app-to-do-assignment-popup',
  templateUrl: './to-do-assignment-popup.component.html',
  styleUrl: './to-do-assignment-popup.component.scss'
})
export class TodDoAssignmentsPopupComponent {
  constructor(
    public dialogRef: MatDialogRef<TodDoAssignmentsPopupComponent>,
    public translationService: TranslationService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data);
  }

  onClose(): void {
    this.dialogRef.close();
  }


}
