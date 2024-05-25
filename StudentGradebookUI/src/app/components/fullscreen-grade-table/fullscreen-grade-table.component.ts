import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Assignment } from 'src/app/models/assignment.model';
import { GradeDetailPopupComponent } from '../grade-details-popup/grade-detail-popup/grade-detail-popup.component';
import { TranslationService } from 'src/app/services/translation/translation-service.service';

@Component({
  selector: 'app-fullscreen-grade-table',
  templateUrl: './fullscreen-grade-table.component.html',
  styleUrls: ['./fullscreen-grade-table.component.scss']
})
export class FullscreenGradeTableComponent {
  constructor(
    public dialogRef: MatDialogRef<FullscreenGradeTableComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private translationService: TranslationService
  ) {
    console.log(data);
    this.uniqueDates = data.uniqueDates;
    this.uniqueDisciplines = data.uniqueDisciplines;
    this.assignments = data.assignments;
  }

  uniqueDisciplines: any[] = [];
  uniqueDates: any[] = [];
  assignments: Assignment[] = [];


  onClose(): void {
    this.dialogRef.close();
  }

  getGrade(disciplineId: number, date: string): number | null {
    const assignment = this.assignments.find(a =>
      a.disciplineId === disciplineId && new Date(a.gradeDate).toDateString() === date
    );

    return assignment ? assignment.grade : null;
  }

  openGradeDetail(disciplineId: number, date: Date) {
    const assignment = this.assignments.find(a => a.disciplineId === disciplineId && new Date(a.gradeDate).toDateString() === new Date(date).toDateString());
    if (!assignment) {
      return;
    }

    const statusText = this.getStatusText(assignment['statusId']);
    const dueDateColor = new Date(assignment.dueDate) < new Date(assignment.gradeDate) ? 'red' : 'green';

    this.dialog.open(GradeDetailPopupComponent, {
      width: '600px',
      data: {
        assignment,
        statusText,
        dueDateColor
      }
    });
  }


   getStatusText(statusId: number): string {
    const langCode = this.translationService.currentLang;
    switch (statusId) {
      case 1:
        return langCode === 'UA' ? 'Надіслано викладачу' : 'Given to the teacher';
      case 2:
        return langCode === 'UA' ? 'Не надіслано викладачу' : 'Not given to the teacher';
      case 3:
        return langCode === 'UA' ? 'Не захищено' : 'Not protected';
      case 4:
        return langCode === 'UA' ? 'Виконано' : 'Done';
      default:
        return 'Unknown';
    }
  }

}
