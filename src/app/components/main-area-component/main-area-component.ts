import { Component, OnDestroy } from '@angular/core';
import { ConfirmDialogService } from '../../core/services/confirm-dialog.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main-area-component',
  standalone: false,
  templateUrl: './main-area-component.html',
  styleUrl: './main-area-component.css',
})
export class MainAreaComponent implements OnDestroy {
  private subs = new Subscription();

  constructor(private confirmService: ConfirmDialogService) {}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  demoDeactivateSkill() {
    this.subs.add(
      this.confirmService.open({
        title: 'Deactivate Skill',
        message: 'Are you sure you want to deactivate the "Data Analytics" skill? Users will no longer be able to interact with it.',
        type: 'danger',
        confirmText: 'Deactivate',
        requireTextConfirmation: true,
        confirmationKeyword: 'DEACTIVATE'
      }).subscribe((confirmed: boolean) => {
        if (confirmed) console.log('Skill Deactivated!');
      })
    );
  }

  demoBlockAccount() {
    this.subs.add(
      this.confirmService.open({
        title: 'Block User Account',
        message: 'You are about to suspend this user account. They will be logged out immediately.',
        type: 'warning',
        confirmText: 'Block Account'
      }).subscribe((confirmed: boolean) => {
        if (confirmed) console.log('Account Blocked!');
      })
    );
  }

  demoDiscardEdits() {
    this.subs.add(
      this.confirmService.open({
        title: 'Discard Unsaved Edits?',
        message: 'You have unsaved changes in this form. Are you sure you want to discard them? This action cannot be undone.',
        type: 'primary',
        confirmText: 'Discard Changes',
        cancelText: 'Keep Editing'
      }).subscribe((confirmed: boolean) => {
        if (confirmed) console.log('Edits Discarded!');
      })
    );
  }
}
