import { Component } from '@angular/core';
import { ToastService } from '../services/toast/toast.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(public toastService: ToastService) {
    
  }

}
