import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-breadcrumb-component',
  standalone: false,
  templateUrl: './breadcrumb-component.html',
  styleUrl: './breadcrumb-component.css',
})
export class BreadcrumbComponent {
  @Output() menuClick = new EventEmitter<void>();
}
