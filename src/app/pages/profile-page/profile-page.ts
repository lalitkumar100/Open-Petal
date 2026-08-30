import { Component, OnInit } from '@angular/core';
import { ConfirmDialogService } from '../../core/services/confirm-dialog.service';

@Component({
  selector: 'app-profile-page',
  standalone: false,
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css',
})
export class ProfilePage implements OnInit {
  // Mock User Data
  user = {
    firstName: 'Alex',
    lastName: 'Rivera',
    email: 'alex.rivera@example.com',
    phone: '+91 9876543210',
    dob: '1999-08-20',
    gender: 'Male',
    role: 'ROLE_USER',
    status: 'ACTIVE', // 'ACTIVE' | 'INACTIVE'
  };

  // State
  isEditMode = false;
  isSaving = false;
  isUpdatingPassword = false;

  // Form Models
  editForm = { ...this.user };

  passwordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  constructor(private confirmService: ConfirmDialogService) {}

  ngOnInit(): void {
    // In a real app, we would fetch profile data here.
  }

  get initials(): string {
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
    
    // Simulate API call
    setTimeout(() => {
      this.user = { ...this.editForm };
      this.isSaving = false;
      this.isEditMode = false;
      const dialog = document.getElementById('saveConfirmDialog') as HTMLDialogElement;
      if (dialog) {
        dialog.close();
      }
    }, 1000);
  }

  cancelSaveProfile() {
      const dialog = document.getElementById('saveConfirmDialog') as HTMLDialogElement;
      if (dialog) {
        dialog.close();
      }
  }

  toggleAccountStatus(): void {
    const newStatus = this.user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const action = newStatus === 'ACTIVE' ? 'activate' : 'pause';

    this.confirmService.open({
      title: 'Change Account Status',
      message: `Are you sure you want to ${action} your account?`,
      confirmText: 'Yes, change status',
      cancelText: 'Cancel'
    }).subscribe(confirmed => {
      if (confirmed) {
        this.user.status = newStatus;
      }
    });
  }

  async updatePassword(event: Event) {
    event.preventDefault();
    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      return; // Validation prevents this, but safety check
    }

    this.confirmService.open({
      title: 'Update Password',
      message: 'Are you sure you want to change your login credentials? You will need to use your new password next time you log in.',
      confirmText: 'Update Password',
      cancelText: 'Cancel'
    }).subscribe(confirmed => {
      if (confirmed) {
        this.isUpdatingPassword = true;
        // Simulate API call
        setTimeout(() => {
          this.isUpdatingPassword = false;
          this.passwordForm = { currentPassword: '', newPassword: '', confirmPassword: '' };
          // Optionally show success toast here
        }, 1000);
      }
    });
  }

  // Helpers for password visibility
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
}
