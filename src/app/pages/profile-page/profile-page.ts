import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { UserService, UserProfile, AvailabilitySlot } from '../../core/services/user.service';

@Component({
  selector: 'app-profile-page',
  standalone: false,
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css',
})
export class ProfilePage implements OnInit {
  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);

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
    description: '',
  };

  // Availability state
  availabilitySlots: AvailabilitySlot[] = [];
  newSlot: AvailabilitySlot = { dayOfWeek: 'MONDAY', startTime: '09:00', endTime: '17:00' };
  slotError = '';
  isAddingSlot = false;

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

  get maxDob(): string {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    return today.toISOString().split('T')[0];
  }

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
        this.loadAvailabilitySlots();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Failed to load profile', err);
        this.cdr.detectChanges();
      }
    });
  }

  loadAvailabilitySlots(): void {
    this.userService.getAvailabilitySlots().subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          this.availabilitySlots = res.data;
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Failed to load availability slots', err);
        this.cdr.detectChanges();
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
      gender: this.editForm.gender,
      description: this.editForm.description
    };

    this.userService.updateProfile(payload).subscribe({
      next: (res) => {
        console.log('Update profile response:', res);
        this.isSaving = false;
        if (res.success) {
          if (res.data) {
            this.user = { ...this.user, ...res.data };
          }
          this.isEditMode = false;
        } else {
          this.profileError = res.message || 'Failed to update profile';
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isSaving = false;
        this.profileError = err.error?.message || 'An error occurred while updating profile';
        this.cdr.detectChanges();
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
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isUpdatingPassword = false;
        this.passwordError = err.error?.message || 'An error occurred';
        this.cdr.detectChanges();
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

  // Add slot logic
  onAddSlot() {
    this.slotError = '';

    if (!this.newSlot.startTime || !this.newSlot.endTime) {
      this.slotError = 'Start and End time are required.';
      return;
    }

    const startSplit = this.newSlot.startTime.split(':');
    const endSplit = this.newSlot.endTime.split(':');
    
    const startMins = parseInt(startSplit[0]) * 60 + parseInt(startSplit[1]);
    const endMins = parseInt(endSplit[0]) * 60 + parseInt(endSplit[1]);

    if (startMins >= endMins) {
      this.slotError = 'Start time must be before end time.';
      return;
    }

    if (endMins - startMins < 60) {
      this.slotError = 'Slot duration must be at least 1 hour.';
      return;
    }

    const formattedSlot = {
      dayOfWeek: this.newSlot.dayOfWeek,
      startTime: this.newSlot.startTime,
      endTime: this.newSlot.endTime
    };

    this.isAddingSlot = true;
    this.userService.addAvailabilitySlot(formattedSlot).subscribe({
      next: (res) => {
        this.isAddingSlot = false;
        if (res.success) {
          this.availabilitySlots = res.data;
          this.newSlot = { dayOfWeek: 'MONDAY', startTime: '09:00', endTime: '17:00' };
        } else {
          this.slotError = res.message || 'Failed to add slot';
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isAddingSlot = false;
        this.slotError = err.error?.message || 'An error occurred';
        this.cdr.detectChanges();
      }
    });
  }

  onRemoveSlot(slot: AvailabilitySlot) {
    this.userService.removeAvailabilitySlot(slot).subscribe({
      next: (res) => {
        if (res.success) {
          this.availabilitySlots = res.data;
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to remove slot', err);
        this.cdr.detectChanges();
      }
    });
  }
}
