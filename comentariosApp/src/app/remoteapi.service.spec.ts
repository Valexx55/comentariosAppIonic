import { TestBed } from '@angular/core/testing';

import { RemoteApiService } from './remoteapi.service';

describe('RemoteapiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RemoteApiService = TestBed.get(RemoteApiService);
    expect(service).toBeTruthy();
  });
});
