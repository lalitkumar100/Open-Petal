import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/services/auth.service';
import { LocationService, LocationResponse } from '../../../core/services/location.service';

export interface UserDetailsDto {
  userInfo: {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    status: string;
    role: string;
    credit: number;
    createdAt: string;
  };
  skillsOffered: { 
    id?: number;
    name: string; 
    level: string; 
    creditsPerSession: number;
    sessionDurationMin: number;
    isVerified?: boolean;
  }[];
  learningGoals: { name: string; level: string, id?: number }[];
  connectionStatus: string;
  connectionSender: boolean;
  connectionRequestId: number;
}

export function sessionDurationValidator(minDurationFn: () => number) {
  return (formGroup: FormGroup) => {
    const startControl = formGroup.get('startTime');
    const endControl = formGroup.get('endTime');
    
    if (!startControl?.value || !endControl?.value) {
      return null;
    }
    
    const [startH, startM] = startControl.value.split(':').map(Number);
    const [endH, endM] = endControl.value.split(':').map(Number);
    
    const startMins = startH * 60 + startM;
    const endMins = endH * 60 + endM;
    
    const minDuration = 1; // minDurationFn() bypassed for dev testing
    let duration = endMins - startMins;
    if (duration < 0) duration += 24 * 60; // Handle cross-midnight

    if (duration < minDuration) {
      return { durationTooShort: { required: minDuration, actual: duration } };
    }
    
    return null;
  };
}

@Component({
  selector: 'app-user-details-page',
  standalone: false,
  templateUrl: './user-details-page.html',
})
export class UserDetailsPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  userId: string | null = null;
  userDetails: UserDetailsDto | null = null;
  isLoading = false;
  error: string | null = null;

  isConnectModalOpen = false;
  connectForm: FormGroup;
  isSubmitting = false;

  isSessionModalOpen = false;
  sessionForm: FormGroup;
  isSubmittingSession = false;
  sessionSuccess: string | null = null;
  sessionError: string | null = null;
  locations: LocationResponse[] = [];
  locationService = inject(LocationService);

  loggedInUserId: number | null = null;
  loggedInUserDetails: UserDetailsDto | null = null;
  barterableSkills: { name: string; level: string, id?: number }[] = [];
  hasTeachingSkills = true;
  hasSufficientCredits = true;


  constructor() {
    this.connectForm = this.fb.group({
      primarySkillId: [''],
      offeredSkillId: [''],
      initialMessage: ['']
    });
    

    this.sessionForm = this.fb.group({
      primarySkillId: ['', [Validators.required]],
      sessionType: ['CREDIT', [Validators.required]],
      offeredSkillId: [''],
      mode: ['ONLINE', [Validators.required]],
      meetingLink: ['', [Validators.required]],
      locationId: [''],
      sessionDate: ['', [Validators.required]],
      startTime: ['', [Validators.required]],
      endTime: ['', [Validators.required]],
      creditsHeld: [{value: 0, disabled: true}, [Validators.required, Validators.min(0)]]
    }, { validators: sessionDurationValidator(() => this.getSelectedSkillMinDuration()) });

    this.setupSessionFormListeners();
  }

  getSelectedSkillMinDuration(): number {
    const skillId = this.sessionForm?.get('primarySkillId')?.value;
    if (skillId && this.userDetails) {
      const skill = this.userDetails.skillsOffered.find(s => s.id == skillId);
      if (skill && skill.sessionDurationMin) {
        return skill.sessionDurationMin;
      }
    }
    return 15; // default fallback
  }

  setupSessionFormListeners() {
    // Mode listener
    this.sessionForm.get('mode')?.valueChanges.subscribe(mode => {
      if (mode === 'ONLINE') {
        this.sessionForm.get('meetingLink')?.setValidators([Validators.required]);
        this.sessionForm.get('locationId')?.clearValidators();
        this.sessionForm.get('locationId')?.setValue('');
      } else {
        this.sessionForm.get('locationId')?.setValidators([Validators.required]);
        this.sessionForm.get('meetingLink')?.clearValidators();
        this.sessionForm.get('meetingLink')?.setValue('');
        if (this.locations.length === 0) {
          this.fetchLocations();
        }
      }
      this.sessionForm.get('meetingLink')?.updateValueAndValidity();
      this.sessionForm.get('locationId')?.updateValueAndValidity();
    });

    // Session Type listener
    this.sessionForm.get('sessionType')?.valueChanges.subscribe(type => {
      if (type === 'BARTER') {
        this.sessionForm.get('offeredSkillId')?.setValidators([Validators.required]);
        this.sessionForm.get('creditsHeld')?.setValue(0);
      } else {
        this.sessionForm.get('offeredSkillId')?.clearValidators();
        this.sessionForm.get('offeredSkillId')?.setValue('');
        this.updateCreditCost();
      }
      this.sessionForm.get('offeredSkillId')?.updateValueAndValidity();
    });

    // Primary Skill listener (to update credit cost)
    this.sessionForm.get('primarySkillId')?.valueChanges.subscribe(skillId => {
      if (this.sessionForm.get('sessionType')?.value === 'CREDIT') {
        this.updateCreditCost(skillId);
      }
      // Trigger cross-field validation for duration
      this.sessionForm.updateValueAndValidity();
    });
  }

  updateCreditCost(skillId?: number) {
    if (!skillId) skillId = this.sessionForm.get('primarySkillId')?.value;
    if (!skillId || !this.userDetails) return;
    
    const skill = this.userDetails.skillsOffered.find(s => s.id == skillId);
    if (skill && skill.creditsPerSession !== undefined) {
      this.sessionForm.get('creditsHeld')?.setValue(skill.creditsPerSession);
      
      // Check sufficiency
      if (this.loggedInUserDetails) {
        this.hasSufficientCredits = this.loggedInUserDetails.userInfo.credit >= skill.creditsPerSession;
      }
    }
  }

  fetchLocations() {
    this.locationService.getAllLocations().subscribe({
      next: (res) => {
        this.locations = res;
        this.cdr.detectChanges();
      }
    });
  }

  ngOnInit() {
    const user = this.authService.getUser();
    if (user && user.userId) {
      this.loggedInUserId = user.userId;
    }

    this.userId = this.route.snapshot.paramMap.get('userId');
    if (this.userId) {
      this.fetchUserDetails(this.userId);
    } else {
      this.error = "User ID not found in route.";
    }
  }

  fetchUserDetails(id: string) {
    this.isLoading = true;
    this.error = null;
    this.cdr.detectChanges();
    
    // Call the new Search API endpoint
    const url = `${environment.apiUrl}/${environment.apiVersion}/search/users/${id}/details`;
    
    this.http.get<any>(url).subscribe({
      next: (res) => {
        if (res.success) {
          this.userDetails = res.data;
        } else {
          this.error = res.message || "Failed to load user details.";
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.message || "Failed to load user details. Please try again.";
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openConnectModal() {
    this.isConnectModalOpen = true;
  }

  closeConnectModal() {
    this.isConnectModalOpen = false;
    this.connectForm.reset();
  }

  openSessionModal() {
    this.isSessionModalOpen = true;
    this.sessionSuccess = null;
    this.sessionError = null;
    this.sessionForm.reset({
      sessionType: 'CREDIT',
      mode: 'ONLINE',
      creditsHeld: 0
    });
    this.cdr.detectChanges();

    if (this.loggedInUserId && !this.loggedInUserDetails) {
      this.http.get<any>(`${environment.apiUrl}/${environment.apiVersion}/search/users/${this.loggedInUserId}/details`).subscribe({
        next: (res) => {
          if (res.success) {
            this.loggedInUserDetails = res.data;
            this.calculateBarterableSkills();
          }
        }
      });
    } else {
      this.calculateBarterableSkills();
    }
  }

  calculateBarterableSkills() {
    if (!this.userDetails || !this.loggedInUserDetails) return;
    
    // Mentor wants to learn (learningGoals)
    const mentorWants = this.userDetails.learningGoals;
    // Logged in user can teach (skillsOffered)
    const iCanTeach = this.loggedInUserDetails.skillsOffered;

    // Intersect by skill name
    this.barterableSkills = mentorWants.filter(goal => 
      iCanTeach.some(mySkill => mySkill.name.toLowerCase() === goal.name.toLowerCase())
    );
    this.hasTeachingSkills = iCanTeach.length > 0;
    
    // Re-check credits now that loggedInUserDetails is available
    this.updateCreditCost();
    
    this.cdr.detectChanges();
  }

  closeSessionModal() {
    this.isSessionModalOpen = false;
    this.cdr.detectChanges();
  }

  submitSession() {
    if (this.sessionForm.invalid || !this.userDetails) {
      this.sessionForm.markAllAsTouched();
      return;
    }
    
    this.isSubmittingSession = true;
    this.sessionError = null;
    this.sessionSuccess = null;
    this.cdr.detectChanges();

    const formValue = this.sessionForm.getRawValue(); // gets disabled fields too
    const payload = {
      mentorId: this.userDetails.userInfo.userId,
      ...formValue
    };

    const url = `${environment.apiUrl}/${environment.apiVersion}/sessions/create`;
    
    this.http.post<any>(url, payload).subscribe({
      next: (res) => {
        this.isSubmittingSession = false;
        if (res.success) {
          this.sessionSuccess = "Session created successfully!";
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isSubmittingSession = false;
        this.sessionError = err.error?.message || "Failed to create session.";
        this.cdr.detectChanges();
      }
    });
  }

  submitConnect() {
    if (this.connectForm.invalid || !this.userDetails) return;
    this.isSubmitting = true;
    
    const payload = {
      receiverId: this.userDetails.userInfo.userId,
      ...this.connectForm.value
    };
    
    const url = `${environment.apiUrl}/${environment.apiVersion}/connections/send`;
    
    this.http.post<any>(url, payload).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.closeConnectModal();
        if (res.success) {
          alert('Connection request sent successfully!');
          this.fetchUserDetails(this.userId!); // refresh state
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        alert(err.error?.message || 'Failed to send request');
      }
    });
  }

  acceptConnection() {
    if (!this.userDetails || !this.userDetails.connectionRequestId) return;
    
    const url = `${environment.apiUrl}/${environment.apiVersion}/connections/accept/${this.userDetails.connectionRequestId}`;
    this.http.post<any>(url, {}).subscribe({
      next: (res) => {
        if (res.success) {
          this.fetchUserDetails(this.userId!); // refresh state
        }
      }
    });
  }


  getInitials(firstName: string, lastName: string): string {
    const f = firstName ? firstName.trim().charAt(0) : '';
    const l = lastName ? lastName.trim().charAt(0) : '';
    const initials = (f + l).toUpperCase();
    return initials || '??';
  }

  goToInbox() {
    this.router.navigate(['/user/inbox']);
  }
}