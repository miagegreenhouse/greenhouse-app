import { Component, OnInit } from '@angular/core';
import { AppConfigService } from '../../../../services/appConfig/app-config.service'

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {

  newMail: string = "";
  mailList: string[];
  
  constructor(public appConfig: AppConfigService) {
    //this.mailList = this.appConfig.config.mailList;
   }

  ngOnInit() {
    
  }

  addMail(){
    this.appConfig.addMail(this.newMail);
  }

  removeEMail(mail: string){
    this.appConfig.removeMail(mail);
  }

}
