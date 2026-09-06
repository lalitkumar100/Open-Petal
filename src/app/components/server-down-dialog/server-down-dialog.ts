import { Component, inject } from '@angular/core';
import { ErrorDialog } from '../../core/services/error-dialog';

@Component({
  selector: 'app-server-down-dialog',
  standalone: false,
  templateUrl: './server-down-dialog.html'
})
export class ServerDownDialog {
  errorDialog = inject(ErrorDialog);

  onClose() {
    this.errorDialog.hideServerDown();
  }
  
  onRetry() {
    this.errorDialog.hideServerDown();
    window.location.reload();
  }
}
