import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-small-table',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="my-3 flex flex-col border border-gray-200 rounded-xl overflow-hidden shadow-md bg-white w-full h-full">
      <div class="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 font-semibold text-sm text-gray-800 border-b border-gray-200 flex justify-between items-center shrink-0">
        <span class="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {{ label || 'Results Data' }}
        </span>
        <span class="text-xs font-normal text-gray-500 bg-white px-2 py-1 rounded border shadow-sm">{{ data.length }} rows</span>
      </div>
      <div class="overflow-auto flex-1 w-full bg-white relative">
        <table class="w-full text-left text-sm whitespace-nowrap">
          <thead class="bg-gray-50 text-xs uppercase text-gray-600 sticky top-0 z-10 shadow-sm ring-1 ring-gray-200">
            <tr>
              <th *ngFor="let col of columns; let first = first; let last = last" 
                  class="px-4 py-3 font-semibold bg-gray-50 tracking-wider border-b border-gray-200"
                  [ngClass]="{'pl-6': first, 'pr-6': last}">
                {{ col }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr *ngFor="let row of data; let i = index" 
                class="hover:bg-blue-50/50 transition-colors duration-150 ease-in-out group"
                [ngClass]="{'bg-white': i % 2 === 0, 'bg-gray-50/30': i % 2 !== 0}">
              <td *ngFor="let col of columns; let first = first; let last = last" 
                  class="px-4 py-3 text-gray-700 group-hover:text-gray-900"
                  [ngClass]="{'pl-6': first, 'pr-6': last}">
                {{ row[col] !== null && row[col] !== undefined ? row[col] : '-' }}
              </td>
            </tr>
            <tr *ngIf="data.length === 0">
              <td [attr.colspan]="columns.length" class="px-6 py-8 text-center text-gray-500 italic bg-gray-50/50">
                No data available to display
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class SmallTableComponent {
  @Input() label: string = '';
  @Input() set data(value: Record<string, any>[]) {
    this._data = value || [];
    this.columns = this._data.length > 0 ? Object.keys(this._data[0]) : [];
  }
  get data(): Record<string, any>[] {
    return this._data;
  }
  private _data: Record<string, any>[] = [];
  columns: string[] = [];
}
