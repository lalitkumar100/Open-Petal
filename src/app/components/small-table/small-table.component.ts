import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-small-table',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="my-3 border rounded-lg overflow-x-auto shadow-sm">
      <div class="bg-gray-100 px-3 py-1.5 font-medium text-xs text-gray-700 border-b">
        {{ label || 'Results' }}
      </div>
      <table class="w-full text-left text-sm border-collapse">
        <thead class="bg-gray-50 border-b text-xs uppercase text-gray-600">
          <tr>
            <th *ngFor="let col of columns" class="px-3 py-2 border-r last:border-r-0">{{ col }}</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let row of data" class="border-b last:border-b-0 hover:bg-gray-50">
            <td *ngFor="let col of columns" class="px-3 py-2 border-r last:border-r-0">{{ row[col] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `
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
