import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocationService, LocationResponse } from '../../../core/services/location.service';

@Component({
  selector: 'app-locations',
  standalone: false,
  templateUrl: './locations.html',
  styleUrl: './locations.css',
})
export class Locations implements OnInit {
  locations: LocationResponse[] = [];
  isLoading: boolean = true;
  currentPage: number = 1;
  pageSize: number = 25;
  
  isAddModalOpen: boolean = false;
  isDetailsModalOpen: boolean = false;
  selectedLocation: LocationResponse | null = null;
  
  isSubmitting: boolean = false;
  error: string | null = null;
  success: string | null = null;

  locationForm: FormGroup;

  constructor(
    private locationService: LocationService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.locationForm = this.fb.group({
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      area: ['', Validators.required],
      city: ['', Validators.required],
      pincode: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadLocations();
  }

  loadLocations(): void {
    this.isLoading = true;
    this.locationService.getAllLocations().subscribe({
      next: (data) => {
        this.locations = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Failed to load locations';
        this.isLoading = false;
        console.error(err);
        this.cdr.detectChanges();
      }
    });
  }

  get paginatedLocations(): LocationResponse[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.locations.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.locations.length / this.pageSize) || 1;
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.cdr.detectChanges();
    }
  }

  min(a: number, b: number): number {
    return Math.min(a, b);
  }

  openAddModal(): void {
    this.isAddModalOpen = true;
    this.error = null;
    this.success = null;
    this.locationForm.reset();
    this.cdr.detectChanges();
  }

  closeAddModal(): void {
    if (!this.isSubmitting) {
      this.isAddModalOpen = false;
      this.cdr.detectChanges();
    }
  }

  openDetailsModal(location: LocationResponse): void {
    this.selectedLocation = location;
    this.isDetailsModalOpen = true;
    this.cdr.detectChanges();
  }

  closeDetailsModal(): void {
    this.isDetailsModalOpen = false;
    this.selectedLocation = null;
    this.cdr.detectChanges();
  }

  onSubmitLocation(): void {
    if (this.locationForm.invalid) {
      this.locationForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.error = null;
    this.success = null;
    this.cdr.detectChanges();

    this.locationService.createLocation(this.locationForm.value).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.success = 'Location added successfully!';
        this.loadLocations();
        this.cdr.detectChanges();
        
        setTimeout(() => {
          this.closeAddModal();
        }, 1000);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.error = 'Failed to add location. Please try again.';
        console.error(err);
        this.cdr.detectChanges();
      }
    });
  }
}
