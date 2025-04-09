import { Pipe, PipeTransform } from '@angular/core';
import { LanguageService } from '../../services/language.service';


@Pipe({
  name: 'dynamicNumber',
  pure: false
})
export class DynamicNumberPipe implements PipeTransform {

  constructor(private languageService: LanguageService) {}

  transform(value: number | null | undefined, minimumFractionDigits = 2, maximumFractionDigits = 2): string {
    if (value === null || value === undefined) return '';

    const lang = this.languageService.getLang();
    const formatter = new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'pt-BR', {
      minimumFractionDigits,
      maximumFractionDigits
    });

    return formatter.format(value);
  }
}
