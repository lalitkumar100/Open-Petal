import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

export interface Breadcrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumb-component',
  standalone: false,
  templateUrl: './breadcrumb-component.html',
  styleUrl: './breadcrumb-component.css',
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbs: Breadcrumb[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.buildBreadcrumbs(this.router.url);
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.buildBreadcrumbs(event.urlAfterRedirects);
      });
  }

  private buildBreadcrumbs(url: string) {
    const segments = url.split('/').filter(segment => segment);
    this.breadcrumbs = [];
    
    let currentUrl = '';
    for (const segment of segments) {
      currentUrl += `/${segment}`;
      const label = segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      this.breadcrumbs.push({ label, url: currentUrl });
    }
  }
}
