import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslationService } from 'src/app/services/translation/translation-service.service';

@Component({
  selector: 'app-grade-detail-popup',
  templateUrl: './grade-detail-popup.component.html',
  styleUrls: ['./grade-detail-popup.component.css']
})
export class GradeDetailPopupComponent {
  constructor(
    public dialogRef: MatDialogRef<GradeDetailPopupComponent>,
    public translationService: TranslationService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }

  GetTranslation(value) {
    return this.translationService.translate(value);
  }
}
