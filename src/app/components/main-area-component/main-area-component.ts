import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main-area-component',
  standalone: false,
  templateUrl: './main-area-component.html',
  styleUrl: './main-area-component.css',
})
export class MainAreaComponent implements OnDestroy {
  private subs = new Subscription();

  constructor() {}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  demoDeactivateSkill() {
    if (confirm('Are you sure you want to deactivate the "Data Analytics" skill? Users will no longer be able to interact with it.')) {
      console.log('Skill Deactivated!');
    }
  }

  demoBlockAccount() {
    if (confirm('You are about to suspend this user account. They will be logged out immediately.')) {
      console.log('Account Blocked!');
    }
  }

  demoDiscardEdits() {
    if (confirm('You have unsaved changes in this form. Are you sure you want to discard them? This action cannot be undone.')) {
      console.log('Edits Discarded!');
    }
  }
}
