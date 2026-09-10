import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-skill-page',
  standalone: false,
  templateUrl: './skill-page.html',
  styleUrl: './skill-page.css',
})
export class SkillPage implements OnInit {
  skills: any[] = [];
  isLoading = false;
  searchQuery = '';
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0;
  
  selectedSkill: any = null;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadSkills();
  }

  loadSkills() {
    this.isLoading = true;
    let url = `${environment.apiUrl}/${environment.apiVersion}/skills/details/page?page=${this.currentPage}&size=${this.pageSize}`;
    if (this.searchQuery && this.searchQuery.trim() !== '') {
      url += `&search=${encodeURIComponent(this.searchQuery.trim())}`;
    }

    this.http.get<any>(url).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.skills = res.data.content;
          this.totalPages = res.data.totalPages;
          this.totalRecords = res.data.totalElements;
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSearch() {
    this.currentPage = 0;
    this.loadSkills();
  }

  changePage(delta: number) {
    const newPage = this.currentPage + delta;
    if (newPage >= 0 && newPage < this.totalPages) {
      this.currentPage = newPage;
      this.loadSkills();
    }
  }

  viewSkillDetails(skill: any) {
    this.selectedSkill = skill;
    const modal = document.getElementById('view_skill_modal') as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  }

  closeSkillDetails() {
    const modal = document.getElementById('view_skill_modal') as HTMLDialogElement;
    if (modal) {
      modal.close();
    }
    this.selectedSkill = null;
  }
}
