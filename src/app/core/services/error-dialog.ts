import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorDialog {
  private showAccessDeniedSubject = new BehaviorSubject<boolean>(false);
  showAccessDenied$ = this.showAccessDeniedSubject.asObservable();

  private showUnauthorizedSubject = new BehaviorSubject<boolean>(false);
  showUnauthorized$ = this.showUnauthorizedSubject.asObservable();

  private showServerDownSubject = new BehaviorSubject<boolean>(false);
  showServerDown$ = this.showServerDownSubject.asObservable();

  showAccessDenied() {
    this.showAccessDeniedSubject.next(true);
  }

  hideAccessDenied() {
    this.showAccessDeniedSubject.next(false);
  }

  showUnauthorized() {
    this.showUnauthorizedSubject.next(true);
  }

  hideUnauthorized() {
    this.showUnauthorizedSubject.next(false);
  }

  showServerDown() {
    this.showServerDownSubject.next(true);
  }

  hideServerDown() {
    this.showServerDownSubject.next(false);
  }
}
