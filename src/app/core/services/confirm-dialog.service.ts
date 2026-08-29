import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ConfirmModalData } from '../models/confirm-modal.model';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {
  private modalStateSubject = new BehaviorSubject<ConfirmModalData | null>(null);
  modalState$ = this.modalStateSubject.asObservable();

  private confirmationSubject: Subject<boolean> | null = null;

  open(data: ConfirmModalData): Observable<boolean> {
    if (this.confirmationSubject) {
      this.confirmationSubject.next(false);
      this.confirmationSubject.complete();
    }

    this.confirmationSubject = new Subject<boolean>();
    
    this.modalStateSubject.next({
      title: data.title || 'Confirm Action',
      message: data.message,
      type: data.type || 'primary',
      confirmText: data.confirmText || 'Confirm',
      cancelText: data.cancelText || 'Cancel',
      requireTextConfirmation: data.requireTextConfirmation || false,
      confirmationKeyword: data.confirmationKeyword || 'CONFIRM'
    });

    return this.confirmationSubject.asObservable();
  }

  confirm(): void {
    if (this.confirmationSubject) {
      this.confirmationSubject.next(true);
      this.confirmationSubject.complete();
      this.confirmationSubject = null;
    }
    this.modalStateSubject.next(null);
  }

  cancel(): void {
    if (this.confirmationSubject) {
      this.confirmationSubject.next(false);
      this.confirmationSubject.complete();
      this.confirmationSubject = null;
    }
    this.modalStateSubject.next(null);
  }
}
