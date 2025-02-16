import { TestBed } from '@angular/core/testing';

import { MlConnectorService } from './ml-connector.service';

describe('MlConnectorService', () => {
  let service: MlConnectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MlConnectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
