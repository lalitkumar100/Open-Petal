import { Component, inject } from '@angular/core';
import { ErrorDialog } from '../../core/services/error-dialog';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-access-denied-dialog',
  standalone: false,
  templateUrl: './access-denied-dialog.html',
  styleUrl: './access-denied-dialog.css',
})
export class AccessDeniedDialog {
  errorDialog = inject(ErrorDialog);
  authService = inject(AuthService);

  onClose() {
    this.errorDialog.hideAccessDenied();
  }

  onLogout() {
    this.errorDialog.hideAccessDenied();
    this.authService.logout();
  }
}
