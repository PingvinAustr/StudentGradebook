import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from './../../services/translation/translation-service.service';

@Pipe({
  name: 'translate',
  pure: false  // make it impure to update value when the language changes
})
export class TranslatePipe implements PipeTransform {
  constructor(private translationService: TranslationService) {}

  transform(value: any, ...args: any[]): any {
    return this.translationService.translate(value);
  }
}
