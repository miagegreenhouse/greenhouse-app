import { Email } from './../../../model/index';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import {DataService} from '../../../services/data/data.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {
  mailInput = '';

  constructor(public dataService: DataService, public toastrService: ToastrService, public alertCtrl: AlertController) {
    console.log(this.dataService);
  }

  ngOnInit() {
  }

  addMail() {
    console.log(this.mailInput);
    let regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if (regexp.test(this.mailInput)) {
      this.dataService.addMail(this.mailInput).subscribe((email) => {
        this.dataService.mails.add(email);
        this.toastrService.success(email.email + ' ajouté');
        this.mailInput = '';
    });
    } else {
      this.toastrService.warning("Format d'adresse non valide");
    }
  }

  removeMail(mail: Email) {
    this.alertCtrl.create({
      header: 'Attention',
      subHeader: 'Êtes-vous sûr de vouloir supprimer ' + mail.email + ' ?',
      buttons: [
        {
          text: 'Non',
          handler: () => {}
        },
        {
          text: 'Oui',
          handler: () => {
            this.dataService.removeMail(mail).subscribe(() => {
              this.toastrService.success(mail.email + ' supprimé');
              this.dataService.mails.delete(mail);
            });
          }
        }
      ]
    }).then(alert => {
      alert.present();
    });
  }

  public formatTime(timestamp: any): string {
    let time = timestamp;
    if (typeof timestamp === 'string') {
      time = parseInt(timestamp);
    }
    const options = {
      year: 'numeric', month: 'numeric', day: 'numeric',
      hour: 'numeric', minute: 'numeric', second: 'numeric'
    };

    return new Date(time).toLocaleDateString('fr-FR', options);
  }

}
