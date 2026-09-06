import { Component, OnInit, ViewChild, inject, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AddSkillDialog } from '../../../components/add-skill-dialog/add-skill-dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-skill-category-details-page',
  standalone: false,
  templateUrl: './skill-category-details-page.html'
})
export class SkillCategoryDetailsPage implements OnInit {
  @ViewChild(AddSkillDialog) addSkillDialog!: AddSkillDialog;

  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  categoryId: number = 0;
  category: any = null;
  
  skills: any[] = [];
  selectedSkill: any = null;
  isSkillDetailsLoading = false;
  
  searchQuery: string = '';
  
  currentPage: number = 0;
  pageSize: number = 25;
  totalPages: number = 0;
  totalRecords: number = 0;
  
  isLoadingCategory = false;
  isLoadingSkills = false;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('categoryId');
      if (id) {
        this.categoryId = +id;
        this.loadCategory();
        this.loadSkills();
      }
    });
  }

  loadCategory() {
    this.isLoadingCategory = true;
    const url = `${environment.apiUrl}/${environment.apiVersion}/skill-categories/${this.categoryId}`;
    this.http.get<any>(url).subscribe({
      next: (res) => {
        // Handle both standard response and raw object response
        if (res.success && res.data) {
          this.category = res.data;
        } else if (res && res.id) {
          this.category = res;
        }
        this.isLoadingCategory = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.isLoadingCategory = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadSkills() {
    this.isLoadingSkills = true;
    this.cdr.detectChanges();
    
    let params = new HttpParams()
      .set('page', this.currentPage.toString())
      .set('size', this.pageSize.toString());
      
    if (this.searchQuery && this.searchQuery.trim() !== '') {
      params = params.set('searchQuery', this.searchQuery.trim());
    }

    const url = `${environment.apiUrl}/${environment.apiVersion}/admin/skill-categories/${this.categoryId}/skills`;
    this.http.get<any>(url, { params }).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.skills = res.data.content || [];
          this.totalPages = res.data.totalPages || 0;
          this.totalRecords = res.data.totalElements || 0;
        } else {
          this.skills = [];
        }
        this.isLoadingSkills = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.isLoadingSkills = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSearch() {
    this.currentPage = 0;
    this.loadSkills();
  }

  changePage(dir: number) {
    this.currentPage += dir;
    this.loadSkills();
  }

  openAddSkillDialog() {
    if (this.addSkillDialog) {
      this.addSkillDialog.open();
    }
  }

  viewSkillDetails(skill: any) {
    this.selectedSkill = skill;
    this.isSkillDetailsLoading = true;
    
    const modal = document.getElementById('view_skill_modal') as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
    
    const url = `${environment.apiUrl}/${environment.apiVersion}/admin/skills/${skill.id}/details`;
    this.http.get<any>(url).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.selectedSkill = res.data;
        }
        this.isSkillDetailsLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load full skill details', err);
        this.isSkillDetailsLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSkillAdded() {
    // Refresh the skills table after a new skill is added
    this.loadSkills();
  }
}
