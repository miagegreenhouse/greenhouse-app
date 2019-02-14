import { AuthenticationService } from './../services/authentication/authentication.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RestService } from '../services/rest/rest.service';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.page.html',
  styleUrls: ['./preferences.page.scss'],
})
export class PreferencesPage implements OnInit {

  constructor(public auth: AuthenticationService, public router: Router, public restService: RestService) { }

  ngOnInit() {
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['home']);
  }

  downloadCSV() {
    this.restService.exportCSV()
    .subscribe((res: string) => {
      let filename = 'data_serre_' + Date.now().toString() + '.csv';
      console.log("Exporting data to file : ", filename);
      FileSaver.saveAs(new Blob([res]), filename);
    }, err => {
      console.error(err);
    });
  }

}
