import { TestBed } from '@angular/core/testing';

import { ErrorDialog } from './error-dialog';

describe('ErrorDialog', () => {
  let service: ErrorDialog;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorDialog);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
