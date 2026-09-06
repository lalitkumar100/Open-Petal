import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserSkillService } from '../../../core/services/user-skill.service';
import { SystemSkill, UserSkill, LearningGoal, SkillLevel, TeachingMode } from '../../../core/models/user-skill.model';

@Component({
  selector: 'app-user-home-page',
  standalone: false,
  templateUrl: './user-home-page.html'
})
export class UserHomePage implements OnInit {
  teachSkills: UserSkill[] = [];
  learningGoals: LearningGoal[] = [];
  systemSkills: SystemSkill[] = [];
  
  isLoading = false;
  
  skillLevels = Object.values(SkillLevel);
  teachingModes = Object.values(TeachingMode);

  addSkillForm: FormGroup;
  addGoalForm: FormGroup;

  isAddSkillModalOpen = false;
  isAddGoalModalOpen = false;
  isDeleteModalOpen = false;

  itemToDelete: { type: 'TEACH' | 'GOAL', id: number } | null = null;

  constructor(
    private userSkillService: UserSkillService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
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
      this.isLoading = false;
      this.cdr.detectChanges();
    }, error => {
      this.isLoading = false;
      this.cdr.detectChanges();
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

  openDeleteModal(type: 'TEACH' | 'GOAL', id: number) {
    this.itemToDelete = { type, id };
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.itemToDelete = null;
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
}
