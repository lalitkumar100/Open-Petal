import { Component, OnInit, inject } from '@angular/core';
import { UserService, UserProfile } from '../../core/services/user.service';

@Component({
  selector: 'app-profile-page',
  standalone: false,
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css',
})
export class ProfilePage implements OnInit {
  private userService = inject(UserService);

  // User Data
  user: UserProfile = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    role: '',
    status: '',
  };

  // State
  isEditMode = false;
  isSaving = false;
  isUpdatingPassword = false;
  isLoading = true;
  profileError = '';
  passwordMessage = '';
  passwordError = '';

  // Form Models
  editForm = { ...this.user };

  passwordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  pendingStatusChange: string | null = null;

  constructor() {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.userService.getProfile().subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success && res.data) {
          this.user = { ...this.user, ...res.data };
          this.editForm = { ...this.user };
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Failed to load profile', err);
      }
    });
  }

  get initials(): string {
    if (!this.user.firstName || !this.user.lastName) return 'U';
    return `${this.user.firstName.charAt(0)}${this.user.lastName.charAt(0)}`.toUpperCase();
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode) {
      this.editForm = { ...this.user }; // Reset form to current user data
    }
  }

  cancelEdit(): void {
    this.isEditMode = false;
  }

  async saveProfile(event: Event) {
    event.preventDefault(); // Prevent native form submission
    
    // DaisyUI modal for confirmation instead of standard ConfirmDialogService if specified, 
    // but the user said "also use daisy dialog to form confrom of edit", 
    // I will trigger a native daisyUI dialog in HTML via a template reference.
    const dialog = document.getElementById('saveConfirmDialog') as HTMLDialogElement;
    if (dialog) {
      dialog.showModal();
    }
  }

  confirmSaveProfile() {
    this.isSaving = true;
    this.profileError = '';
    
    // Close dialog immediately so page loader is visible
    const dialog = document.getElementById('saveConfirmDialog') as HTMLDialogElement;
    if (dialog) dialog.close();
    
    const payload = {
      firstName: this.editForm.firstName,
      lastName: this.editForm.lastName,
      phone: this.editForm.phone,
      dob: this.editForm.dob,
      gender: this.editForm.gender
    };

    this.userService.updateProfile(payload).subscribe({
      next: (res) => {
        this.isSaving = false;
        if (res.success && res.data) {
          this.user = { ...this.user, ...res.data };
          this.isEditMode = false;
        } else {
          this.profileError = res.message || 'Failed to update profile';
        }
      },
      error: (err) => {
        this.isSaving = false;
        this.profileError = err.error?.message || 'An error occurred while updating profile';
      }
    });
  }

  cancelSaveProfile() {
      const dialog = document.getElementById('saveConfirmDialog') as HTMLDialogElement;
      if (dialog) {
        dialog.close();
      }
  }

  toggleAccountStatus(): void {
    this.pendingStatusChange = this.user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const dialog = document.getElementById('statusConfirmDialog') as HTMLDialogElement;
    if (dialog) dialog.showModal();
  }

  confirmStatusChange(): void {
    if (this.pendingStatusChange) {
      this.user.status = this.pendingStatusChange;
    }
    const dialog = document.getElementById('statusConfirmDialog') as HTMLDialogElement;
    if (dialog) dialog.close();
  }

  cancelStatusChange(): void {
    this.pendingStatusChange = null;
    const dialog = document.getElementById('statusConfirmDialog') as HTMLDialogElement;
    if (dialog) dialog.close();
  }

  async updatePassword(event: Event) {
    event.preventDefault();
    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      return; // Validation prevents this, but safety check
    }

    const dialog = document.getElementById('passwordConfirmDialog') as HTMLDialogElement;
    if (dialog) dialog.showModal();
  }

  confirmUpdatePassword(): void {
    this.isUpdatingPassword = true;
    this.passwordError = '';
    this.passwordMessage = '';
    
    const dialog = document.getElementById('passwordConfirmDialog') as HTMLDialogElement;
    if (dialog) dialog.close();
    
    const payload = {
      currentPassword: this.passwordForm.currentPassword,
      newPassword: this.passwordForm.newPassword
    };

    this.userService.changePassword(payload).subscribe({
      next: (res) => {
        this.isUpdatingPassword = false;
        if (res.success) {
          this.passwordMessage = res.message || 'Password changed successfully';
          this.passwordForm = { currentPassword: '', newPassword: '', confirmPassword: '' };
        } else {
          this.passwordError = res.message || 'Failed to update password';
        }
      },
      error: (err) => {
        this.isUpdatingPassword = false;
        this.passwordError = err.error?.message || 'An error occurred';
      }
    });
  }

  cancelUpdatePassword(): void {
    const dialog = document.getElementById('passwordConfirmDialog') as HTMLDialogElement;
    if (dialog) dialog.close();
  }

  // Helpers for password visibility
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
}
