import { TestBed } from '@angular/core/testing';

import { ApiClinetService } from './api-clinet.service';

describe('ApiClinetService', () => {
  let service: ApiClinetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiClinetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
