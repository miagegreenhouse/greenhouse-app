import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import {DataService} from '../../../services/data/data.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {
  mailInput = '';

  constructor(public dataService: DataService, public toastrService: ToastrService) {
   }

  ngOnInit() {
  }

  addMail() {
    console.log(this.mailInput);
    let regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if (regexp.test(this.mailInput)) {
      this.dataService.addMail(this.mailInput).subscribe(() => {
        this.mailInput = '';
    });
    } else {
      this.toastrService.warning("Format d'adresse non valide");
    }
  }

  removeMail(mail: string) {
    this.dataService.removeMail(mail).subscribe(() => {
    });
  }

  public formatTime(timestamp: number): string {
    const options = {
      year: 'numeric', month: 'numeric', day: 'numeric',
      hour: 'numeric', minute: 'numeric', second: 'numeric'
    };

    return new Date().toLocaleDateString('fr-FR', options);
  }

}
