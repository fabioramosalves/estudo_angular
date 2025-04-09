import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  readonly vibraApiUrl = environment.vibraApiUrl;
  readonly userApiUrl = environment.userApiUrl;

  constructor() {}
}