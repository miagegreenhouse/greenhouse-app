import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService, AlertMessage } from 'src/app/services/data/data.service';
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
  buttonValue: string = 'Acquitter';
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
      if(this.alert.timestampAcknowledgment){
        this.alert.message = "L'alerte à déjà été acquitée par un autre utilisateur"; 
        this.buttonValue = "Quitter";
      }
    });
  }

  ngOnDestroy() {
    this.paramSubscription.unsubscribe();
    this.alertSubscription.unsubscribe();
  }

  acknowledge() {
    if(this.alert.timestampAcknowledgment){
      this.router.navigate(['home']);
    }else{
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
