import { Component, OnInit, ViewChild, inject, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AddSkillCategoryDialog } from '../../../components/add-skill-category-dialog/add-skill-category-dialog';

@Component({
  selector: 'app-skill-category-page',
  standalone: false,
  templateUrl: './skill-category-page.html'
})
export class SkillCategoryPage implements OnInit {
  @ViewChild('addDialog') addDialog!: AddSkillCategoryDialog;
  
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  categories: any[] = [];
  
  searchQuery: string = '';
  
  currentPage: number = 0;
  pageSize: number = 25;
  totalPages: number = 0;
  totalRecords: number = 0;
  
  isLoading = false;

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.cdr.detectChanges();
    
    let params = new HttpParams()
      .set('page', this.currentPage.toString())
      .set('size', this.pageSize.toString());
      
    if (this.searchQuery && this.searchQuery.trim() !== '') {
      params = params.set('searchQuery', this.searchQuery.trim());
    }

    const url = `${environment.apiUrl}/${environment.apiVersion}/skill-categories`;
    this.http.get<any>(url, { params }).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.categories = res.data.content || [];
          this.totalPages = res.data.totalPages || 0;
          this.totalRecords = res.data.totalElements || 0;
        } else {
          this.categories = [];
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
    this.loadData();
  }

  changePage(dir: number) {
    this.currentPage += dir;
    this.loadData();
  }

  openAddDialog() {
    this.addDialog.open();
  }
}
