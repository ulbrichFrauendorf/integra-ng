import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataUpdateEventService {
  private dataUpdatedSource = new BehaviorSubject<void>(undefined);
  dataUpdated$ = this.dataUpdatedSource.asObservable();

  notifyDataUpdated() {
    this.dataUpdatedSource.next();
  }
}
