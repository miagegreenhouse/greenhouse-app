import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data/data.service';
import { ToastrService } from 'ngx-toastr';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-alert-viewer',
  templateUrl: './alert-viewer.component.html',
  styleUrls: ['./alert-viewer.component.scss']
})
export class AlertViewerComponent implements OnInit {

  id: string;
  token: string;
  alert: any;
  private paramSubscription: Subscription;
  private alertSubscription: Subscription;

  constructor( private route: ActivatedRoute, private router: Router, private dataService: DataService, private toastr: ToastrService) { }

  ngOnInit() {
    this.paramSubscription = this.route.params.subscribe(params => {
      this.id = params['alertId'];
      this.token = params['token'];
   });
    this.alertSubscription = this.dataService.getAlertById(this.id).subscribe((value) => {
      this.alert = value;
    });
  }

  ngOnDestroy() {
    this.paramSubscription.unsubscribe();
    this.alertSubscription.unsubscribe();
  }

  acknowledge() {
    this.dataService.acknowledgeAlert(this.id, this.token)
    .subscribe(resp => {
      if (resp.status === 200) {
        this.toastr.success('La notification à bien été acquittée', '', {
          timeOut: 2000,
          positionClass: 'toast-bottom-right',
        }).onHidden.subscribe(() => {
          this.router.navigate(['home']);
        });
      }
    }, error => {
      this.toastr.warning('Impossible d\'acquitter la notification', 'Erreur', {
        timeOut: 5000,
        positionClass: 'toast-bottom-right'
      });
    });
  }
}
