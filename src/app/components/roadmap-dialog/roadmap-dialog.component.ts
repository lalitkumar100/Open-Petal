import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { UserSkillService } from '../../core/services/user-skill.service';
import { RoadmapData, RoadmapNode } from '../../core/models/user-skill.model';

@Component({
  selector: 'app-roadmap-dialog',
  standalone: false,
  templateUrl: './roadmap-dialog.component.html'
})
export class RoadmapDialogComponent implements OnChanges {
  @Input() isOpen: boolean = false;
  @Input() goalId: number | null = null;
  @Input() roadmap: RoadmapData | null = null;
  @Input() goalTitle: string = '';
  @Output() close = new EventEmitter<void>();
  @Output() roadmapUpdated = new EventEmitter<RoadmapData>();

  isLoading: boolean = false;
  hasPlan: boolean = false;

  constructor(private userSkillService: UserSkillService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['roadmap']) {
      this.hasPlan = !!this.roadmap && !!this.roadmap.milestones;
    }
  }

  closeModal(): void {
    this.close.emit();
  }

  onGenerateOrRefresh(): void {
    if (!this.goalId) return;
    
    this.isLoading = true;
    this.userSkillService.generateRoadmap(this.goalId).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        if (response.success && response.data) {
          this.roadmap = response.data.roadplan as RoadmapData;
          this.hasPlan = true;
          this.roadmapUpdated.emit(this.roadmap);
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error('Failed to generate roadmap', err);
      }
    });
  }

  toggleNodeCompletion(node: RoadmapNode): void {
    if (!this.goalId || !this.roadmap) return;
    
    node.completed = !node.completed;
    
    // Optimistic update
    this.userSkillService.updateRoadmapProgress(this.goalId, this.roadmap).subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.roadmapUpdated.emit(this.roadmap!);
        }
      },
      error: (err: any) => {
        console.error('Failed to update progress', err);
        // Revert on error
        node.completed = !node.completed;
      }
    });
  }
}
