import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorDialog } from '../../core/services/error-dialog';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-unauthorized-dialog',
  standalone: false,
  templateUrl: './unauthorized-dialog.html',
})
export class UnauthorizedDialog {
  private errorDialog = inject(ErrorDialog);
  private authService = inject(AuthService);
  private router = inject(Router);

  isVisible$ = this.errorDialog.showUnauthorized$;

  goToLogin() {
    this.errorDialog.hideUnauthorized();
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
