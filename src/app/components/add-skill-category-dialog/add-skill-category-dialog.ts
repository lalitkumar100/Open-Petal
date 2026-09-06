import { Component, EventEmitter, Output, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-add-skill-category-dialog',
  standalone: false,
  templateUrl: './add-skill-category-dialog.html'
})
export class AddSkillCategoryDialog {
  private http = inject(HttpClient);
  
  @Output() categoryAdded = new EventEmitter<void>();

  isVisible = false;
  isLoading = false;
  
  name: string = '';
  description: string = '';
  
  successMessage: string | null = null;
  errorMessage: string | null = null;

  open() {
    this.name = '';
    this.description = '';
    this.successMessage = null;
    this.errorMessage = null;
    this.isVisible = true;
  }

  close() {
    this.isVisible = false;
  }

  submit() {
    if (!this.name.trim()) {
      this.errorMessage = 'Name is required.';
      return;
    }

    this.isLoading = true;
    this.successMessage = null;
    this.errorMessage = null;

    const payload = {
      name: this.name.trim(),
      description: this.description.trim()
    };

    const url = `${environment.apiUrl}/${environment.apiVersion}/admin/skill-categories`;
    this.http.post<any>(url, payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          this.successMessage = res.message || 'Category added successfully!';
          this.categoryAdded.emit();
          setTimeout(() => this.close(), 1500);
        } else {
          this.errorMessage = res.message || 'Failed to add category.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'An error occurred. Please try again.';
      }
    });
  }
}
