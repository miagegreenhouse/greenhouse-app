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

});
