import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AssignmentService } from 'src/app/services/assignments/assignment-service.service';
import { TranslationService } from 'src/app/services/translation/translation-service.service';

@Component({
  selector: 'app-grade-student-detail-popup',
  templateUrl: './grade-student-popup.component.html',
  styleUrls: ['./grade-student-popup.component.css']
})
export class GradeStudentPopup {
  gridMode: boolean;
  constructor(
    public dialogRef: MatDialogRef<GradeStudentPopup>,
    public translationService: TranslationService,
    public assignmentsService: AssignmentService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data);
    this.gridMode = data.gridMode;
  }

    gradeValue: number;
    gradeAssignment(): void {
      if (this.gradeValue !== undefined && this.gradeValue !== null) {
        this.assignmentsService.gradeAssignment(this.data.assignment.entryId, {
            grade: this.gradeValue
        }).subscribe(data => {
           this.snackBar.open(this.translationService.translate('lblGradedSuccess'), this.translationService.translate('lblClose'), { duration: 3000 });
           this.onClose();
        });
    } else {
      console.warn('Grade value is required');
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  GetTranslation(value) {
    return this.translationService.translate(value);
  }
}
