import { Component, ElementRef, ViewChild, Output, EventEmitter, Input, inject, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-add-skill-dialog',
  standalone: false,
  templateUrl: './add-skill-dialog.html'
})
export class AddSkillDialog {
  @ViewChild('dialog') dialog!: ElementRef<HTMLDialogElement>;
  
  @Input() categoryId!: number;
  @Output() skillAdded = new EventEmitter<any>();

  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  skillForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  constructor() {
    this.skillForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]]
    });
  }

  open() {
    this.skillForm.reset();
    this.errorMessage = '';
    this.isSubmitting = false;
    this.dialog.nativeElement.showModal();
    this.cdr.detectChanges();
  }

  close() {
    this.dialog.nativeElement.close();
  }

  onSubmit() {
    if (this.skillForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    const payload = {
      categoryId: this.categoryId,
      name: this.skillForm.value.name,
      description: this.skillForm.value.description
    };

    const url = `${environment.apiUrl}/${environment.apiVersion}/admin/skills`;
    
    this.http.post<any>(url, payload).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        if (res.success) {
          this.skillAdded.emit(res.data);
          this.close();
        } else {
          this.errorMessage = res.message || 'Failed to add skill.';
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || 'An error occurred while adding the skill.';
        this.cdr.detectChanges();
      }
    });
  }
}
