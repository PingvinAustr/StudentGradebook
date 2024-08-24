import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OwlOptions } from 'ngx-owl-carousel-o';
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
    const details = this.data.assignment.assignmentDetails[0];
     this.images = [
      details.imageAttachment1,
      details.imageAttachment2,
      details.imageAttachment3
    ].filter(image => !!image);
  }

  images: string[] = [];


  isDueDateOverdue(dueDate: Date): boolean {
    return new Date(dueDate) < new Date();
  }

  hasImages(details: any): boolean {
    return details.imageAttachment1 || details.imageAttachment2 || details.imageAttachment3;
  }

  hasFiles(details: any): boolean {
    return details.fileAttachment1 || details.fileAttachment2 || details.fileAttachment3;
  }

  onClose(): void {
    this.dialogRef.close();
  }


}
