import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDatePipe',
  standalone: true
})
export class FormatDatePipePipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): unknown {
    if (!value) return ''; 
    return new Date(value).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

}
