import { Pipe, PipeTransform } from '@angular/core';
import { Dataset } from '../models/ai-chat.models';

@Pipe({ name: 'filterTables', standalone: true })
export class FilterTablesPipe implements PipeTransform {
  transform(datasets: Dataset[] | undefined, type: 'small' | 'large'): Dataset[] {
    if (!datasets) return [];
    if (type === 'small') {
      return datasets.filter(t => t.rows <= 10 && t.columns <= 5);
    }
    return datasets.filter(t => t.rows > 10 || t.columns > 5);
  }
}
