import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserSkillService } from '../../../core/services/user-skill.service';
import { SystemSkill, UserSkill, LearningGoal, SkillLevel, TeachingMode } from '../../../core/models/user-skill.model';
import { QueryService } from '../../../core/services/query.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-user-home-page',
  standalone: false,
  templateUrl: './user-home-page.html'
})
export class UserHomePage implements OnInit {
  teachSkills: UserSkill[] = [];
  learningGoals: LearningGoal[] = [];
  systemSkills: SystemSkill[] = [];
  sentRequests: any[] = [];
  receivedRequests: any[] = [];
  
  isLoading = false;
  
  skillLevels = Object.values(SkillLevel);
  teachingModes = Object.values(TeachingMode);

  addSkillForm: FormGroup;
  addGoalForm: FormGroup;

  isAddSkillModalOpen = false;
  isAddGoalModalOpen = false;
  isDeleteModalOpen = false;
  isRoadmapModalOpen = false;

  itemToDelete: { type: 'TEACH' | 'GOAL', id: number } | null = null;
  selectedGoalId: number | null = null;
  selectedRoadmapData: any = null;
  selectedGoalTitle: string = 'Learning Roadmap';

  constructor(
    private userSkillService: UserSkillService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private queryService: QueryService,
    private http: HttpClient
  ) {
    this.addSkillForm = this.fb.group({
      skillId: ['', Validators.required],
      skillLevel: ['', Validators.required],
      experienceYears: [0, [Validators.required, Validators.min(0)]],
      teachingMode: ['', Validators.required],
      creditsPerSession: [10, [Validators.required, Validators.min(5), Validators.max(20)]]
    });

    this.addGoalForm = this.fb.group({
      skillId: ['', Validators.required],
      currentLevel: ['', Validators.required],
      targetLevel: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.userSkillService.getSystemSkills().subscribe(skills => {
      this.systemSkills = skills;
      this.cdr.detectChanges();
      this.loadUserSkills();
    });
  }

  loadUserSkills() {
    this.userSkillService.getTeachSkills().subscribe(skills => {
      this.teachSkills = skills;
      this.cdr.detectChanges();
      this.loadLearningGoals();
    });
  }

  loadLearningGoals() {
    this.userSkillService.getLearningGoals().subscribe(goals => {
      this.learningGoals = goals;
      this.loadSentRequests();
    }, error => {
      this.loadSentRequests();
    });
  }

  loadSentRequests() {
    const url = `${environment.apiUrl}/${environment.apiVersion}/connections/sent`;
    this.http.get<any>(url).subscribe({
      next: (res) => {
        if (res.success) {
          this.sentRequests = res.data;
        }
        this.loadReceivedRequests();
      },
      error: (err) => {
        this.loadReceivedRequests();
      }
    });
  }

  loadReceivedRequests() {
    const url = `${environment.apiUrl}/${environment.apiVersion}/connections/received/pending`;
    this.http.get<any>(url).subscribe({
      next: (res) => {
        if (res.success) {
          this.receivedRequests = res.data;
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  acceptRequest(requestId: number) {
    const url = `${environment.apiUrl}/${environment.apiVersion}/connections/accept/${requestId}`;
    this.http.post<any>(url, {}).subscribe({
      next: (res) => {
        if (res.success) {
          // Refresh data to remove accepted request and update state
          this.loadData();
        }
      },
      error: (err) => {
        alert(err.error?.message || 'Failed to accept request');
      }
    });
  }

  openAddSkillModal() {
    this.addSkillForm.reset({ experienceYears: 0, creditsPerSession: 10 });
    this.successMessage = null;
    this.isAddSkillModalOpen = true;
  }

  closeAddSkillModal() {
    this.isAddSkillModalOpen = false;
    this.successMessage = null;
    this.errorMessage = null;
    this.isSubmitting = false;
  }

  successMessage: string | null = null;
  errorMessage: string | null = null;
  isSubmitting: boolean = false;

  submitAddSkill() {
    if (this.addSkillForm.valid) {
      this.isSubmitting = true;
      this.cdr.detectChanges();
      
      this.userSkillService.addTeachSkill(this.addSkillForm.value).subscribe({
        next: (res) => {
          this.isSubmitting = false;
          this.successMessage = res.message;
          this.cdr.detectChanges();
          
          setTimeout(() => {
            this.closeAddSkillModal();
            window.location.reload();
          }, 5000);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.errorMessage = `Error ${err.status}: ${err.error?.message || 'Failed to add skill'}`;
          this.cdr.detectChanges();
          
          setTimeout(() => {
            this.closeAddSkillModal();
          }, 5000);
        }
      });
    }
  }

  openAddGoalModal() {
    this.addGoalForm.reset();
    this.successMessage = null;
    this.errorMessage = null;
    this.isSubmitting = false;
    this.isAddGoalModalOpen = true;
  }

  closeAddGoalModal() {
    this.isAddGoalModalOpen = false;
    this.successMessage = null;
    this.errorMessage = null;
    this.isSubmitting = false;
  }

  submitAddGoal() {
    if (this.addGoalForm.valid) {
      this.isSubmitting = true;
      this.cdr.detectChanges();

      this.userSkillService.addLearningGoal(this.addGoalForm.value).subscribe({
        next: (res) => {
          this.isSubmitting = false;
          this.successMessage = res.message;
          this.cdr.detectChanges();

          setTimeout(() => {
            this.closeAddGoalModal();
            window.location.reload();
          }, 5000);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.errorMessage = `Error ${err.status}: ${err.error?.message || 'Failed to add learning goal'}`;
          this.cdr.detectChanges();

          setTimeout(() => {
            this.closeAddGoalModal();
          }, 5000);
        }
      });
    }
  }

  openDeleteModal(type: 'TEACH' | 'GOAL', target: any) {
    let targetId: number;
    if (typeof target === 'object' && target !== null) {
      targetId = type === 'TEACH' ? (target.skillId ?? target.id) : target.id;
    } else {
      targetId = target;
    }
    this.itemToDelete = { type, id: targetId };
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.itemToDelete = null;
  }

  openRoadmapModal(goal: LearningGoal) {
    this.selectedGoalId = goal.id;
    this.selectedRoadmapData = null; // Reset first
    this.selectedGoalTitle = `Roadmap: ${goal.skillName}`;
    this.isRoadmapModalOpen = true;

    // Fetch existing plan from backend
    this.userSkillService.getLearningGoalById(goal.id).subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          this.selectedRoadmapData = res.data.roadplan || null;
        } else {
          this.selectedRoadmapData = null;
        }
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Failed to fetch existing plan', err);
        this.selectedRoadmapData = null;
        this.cdr.detectChanges();
      }
    });
  }

  closeRoadmapModal() {
    this.isRoadmapModalOpen = false;
    this.selectedGoalId = null;
    this.selectedRoadmapData = null;
  }

  onRoadmapUpdated(updatedRoadmap: any) {
    if (this.selectedGoalId) {
      const goal = this.learningGoals.find(g => g.id === this.selectedGoalId);
      if (goal) {
        goal.roadplan = updatedRoadmap;
        this.selectedRoadmapData = updatedRoadmap;
        this.cdr.detectChanges();
      }
    }
  }

  confirmDelete() {
    if (!this.itemToDelete) return;
    
    if (this.itemToDelete.type === 'TEACH') {
      this.userSkillService.deleteTeachSkill(this.itemToDelete.id).subscribe(() => {
        this.closeDeleteModal();
        this.loadUserSkills();
      });
    } else {
      this.userSkillService.deleteLearningGoal(this.itemToDelete.id).subscribe(() => {
        this.closeDeleteModal();
        this.loadLearningGoals();
      });
    }
  }

  // Request Skill Modal State
  requestSubject: string = '';
  requestDescription: string = '';
  isSubmittingRequest: boolean = false;
  requestError: string | null = null;
  requestSuccess: boolean = false;

  openRequestModal() {
    this.requestSubject = '';
    this.requestDescription = '';
    this.requestError = null;
    this.requestSuccess = false;
    const modal = document.getElementById('request_skill_modal') as HTMLDialogElement;
    if (modal) modal.showModal();
  }

  closeRequestModal() {
    const modal = document.getElementById('request_skill_modal') as HTMLDialogElement;
    if (modal) modal.close();
  }

  requestNewSkill() {
    if (!this.requestSubject.trim() || !this.requestDescription.trim()) {
      this.requestError = 'Please provide both a skill name and a description.';
      return;
    }

    this.isSubmittingRequest = true;
    this.requestError = null;
    this.cdr.detectChanges();

    this.queryService.submitQuery({
      queryType: 'ADD_NEW_SKILL',
      subject: this.requestSubject,
      description: this.requestDescription
    }).subscribe({
      next: (res) => {
        this.isSubmittingRequest = false;
        if (res.success) {
          this.requestSuccess = true;
          // Close after 2 seconds
          setTimeout(() => {
            this.closeRequestModal();
          }, 2000);
        } else {
          this.requestError = res.message || 'Failed to submit request.';
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isSubmittingRequest = false;
        this.requestError = err.error?.message || 'Error submitting request. Please try again.';
        this.cdr.detectChanges();
      }
    });
  }

  // Verify Skill Modal State
  isVerifyModalOpen = false;
  verifySelectedSkill: UserSkill | null = null;
  verifyQuestions: any[] = [];
  verifyAnswers: string[] = [];
  isVerifyingLoading = false;
  isVerifyingSubmitting = false;
  verifyError: string | null = null;
  verifyStatus: 'PASS' | 'FAIL' | null = null;
  verifyScore: number = 0;

  openVerifyModal(skill: UserSkill) {
    this.verifySelectedSkill = skill;
    this.isVerifyModalOpen = true;
    this.verifyQuestions = [];
    this.verifyAnswers = [];
    this.verifyError = null;
    this.verifyStatus = null;
    this.verifyScore = 0;
    this.isVerifyingLoading = true;
    this.cdr.detectChanges();

    const skillIdToUse = skill.skillId ?? skill.id;
    this.userSkillService.getVerificationQuestions(skillIdToUse).subscribe({
      next: (res) => {
        this.isVerifyingLoading = false;
        if (res.success && res.data) {
          try {
            this.verifyQuestions = JSON.parse(res.data);
            this.verifyAnswers = new Array(this.verifyQuestions.length).fill('');
          } catch (e) {
            this.verifyError = 'Failed to parse questions format.';
          }
        } else {
          this.verifyError = res.message || 'Failed to fetch questions.';
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isVerifyingLoading = false;
        this.verifyError = err.error?.message || 'Error generating questions. Please try again.';
        this.cdr.detectChanges();
      }
    });
  }

  closeVerifyModal() {
    this.isVerifyModalOpen = false;
    if (this.verifyStatus === 'PASS') {
      this.loadUserSkills(); // Refresh the list to show verified badge
    }
    this.verifySelectedSkill = null;
  }

  canSubmitVerification(): boolean {
    return this.verifyQuestions.length > 0 && 
           this.verifyAnswers.length === this.verifyQuestions.length && 
           this.verifyAnswers.every(a => a && a.trim() !== '');
  }

  submitVerification() {
    if (!this.canSubmitVerification() || !this.verifySelectedSkill) return;

    this.isVerifyingSubmitting = true;
    this.verifyError = null;
    this.cdr.detectChanges();

    const skillIdToUse = this.verifySelectedSkill.skillId ?? this.verifySelectedSkill.id;
    this.userSkillService.submitVerificationAnswers(skillIdToUse, this.verifyAnswers).subscribe({
      next: (res) => {
        this.isVerifyingSubmitting = false;
        if (res.success && res.data) {
          this.verifyStatus = res.data.status;
          this.verifyScore = res.data.marks;
        } else {
          this.verifyError = res.message || 'Failed to submit answers.';
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isVerifyingSubmitting = false;
        this.verifyError = err.error?.message || 'Error submitting answers. Please try again.';
        this.cdr.detectChanges();
      }
    });
  }
}
