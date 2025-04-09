import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly LANG_KEY = 'lang';

  private language$ = new BehaviorSubject<string>(this.getStoredLang());

  constructor() {}

  private getStoredLang(): string {
    return localStorage.getItem(this.LANG_KEY) || 'pt';
  }

  getLang(): string {
    return this.language$.value;
  }

  getLang$() {
    return this.language$.asObservable();
  }

  setLang(lang: string) {
    localStorage.setItem(this.LANG_KEY, lang);
    this.language$.next(lang);
  }

  getLocale(): string {
    const lang = this.getLang();
    return lang === 'en' ? 'en-US' : 'pt-BR';
  }
}
