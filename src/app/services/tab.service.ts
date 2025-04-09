import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

export type DashboardTab = 'overview' | 'apuracao';

@Injectable({ providedIn: 'root' })
export class TabService {
  private tabChange$ = new Subject<DashboardTab>();

  changeTab(tab: DashboardTab) {
    this.tabChange$.next(tab);
  }

  onTabChange(): Observable<DashboardTab> {
    return this.tabChange$.asObservable();
  }
}
