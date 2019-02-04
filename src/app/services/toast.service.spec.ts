import { TestBed } from '@angular/core/testing';

import { ToastService } from './toast.service';
import { IonicModule } from '@ionic/angular';

describe('ToastService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      IonicModule.forRoot()
    ],
    providers: [
      ToastService
    ]
  }));

  it('should be created', () => {
    const service: ToastService = TestBed.get(ToastService);
    expect(service).toBeTruthy();
  });

  it('should show a toast', (done) => {
    const service: ToastService = TestBed.get(ToastService);
    service.showToast("It works", undefined, () => {
      done();
    });
  });

});
