import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {

  newMail: string = "";
  mailList: string[] = ["mail1","mail2"];
  
  constructor() { }

  ngOnInit() {
  }

  addMail(){
  }

  removeEMail(mail: string){
  }

}
