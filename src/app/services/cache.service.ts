import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, map, of } from 'rxjs'
import { ConfigService } from './config.service'

@Injectable({ providedIn: 'root' })
export class CacheService {
  private http = inject(HttpClient)
  private configService = inject(ConfigService)
  private apiUrl = this.configService.vibraApiUrl

  private getFilterItens(list: string, textFind: string): Observable<string[]> {
    return this.http
      .get<{ name: string }[]>(
        `${this.apiUrl}/price-monitoring/${list}/${textFind}`
      )
      .pipe(map((response) => response.map((item) => item.name)))
  }

  getCities = (textFind: string): Observable<string[]> =>
    this.getFilterItens('listcities', textFind)

  getProducts = (textFind: string): Observable<string[]> =>
    this.getFilterItens('listproducts', textFind)

  getGasStation = (textFind: string): Observable<string[]> =>
    this.getFilterItens('liststations', textFind)

}
