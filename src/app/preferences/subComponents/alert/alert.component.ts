import { Component, OnInit } from '@angular/core';
import {DataService} from '../../../services/data/data.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {
  newMail: string;
  
  constructor(public dataService: DataService) {
   }

  ngOnInit() {
    
  }

  addMail() {
    // TODO
  }

  removeEMail(mail: string) {
    // TODO
  }

  public formatTime(timestamp: number): string {
    const options = {
      year: 'numeric', month: 'numeric', day: 'numeric',
      hour: 'numeric', minute: 'numeric', second: 'numeric'
    };

    return new Date().toLocaleDateString('fr-FR', options);
  }

}
