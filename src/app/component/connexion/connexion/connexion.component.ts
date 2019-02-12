import { DataService } from './../../../services/data/data.service';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { UserForm } from 'src/app/model';
import { User } from 'src/app/model';
import { ToastrService } from 'ngx-toastr'; 
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.scss']
})
export class ConnexionComponent implements OnInit {

  userForm : UserForm = {email:"",password:""};
  redirect : string = '';

  constructor(public auth : AuthenticationService, private toastr: ToastrService, private router: Router, private route: ActivatedRoute, public dataService: DataService) { }
    
  ngOnInit() {
    console.log("On init");
    this.route.queryParams.subscribe(
      params => {
        console.log(params);
        if (params.redirect) {
          this.redirect = params.redirect;
        }
        this.dataService.getUsersCount().subscribe((response) => {
          console.log(response);
          if (!response.count || response.count < 0) {
            console.log("No user in database");
            this.toastr.info("Vous devez créer un compte administrateur pour la première utilisation");
            this.router.navigate(['register'], {queryParams: {
              redirect: this.redirect
            }});
          }
        }, err => {
          console.error(err);
        });
      }
    );
  }

  afterLogin() {
    if (!this.redirect) {
      this.router.navigate(['home']);
    } else {
      this.router.navigateByUrl(this.redirect);
    }
  }

  login(){
    this.auth.login(this.userForm)
    .then((user: User) => {
      this.toastr.success("Vous êtes connecté avec : "+user.email,"Succès",{
        timeOut: 2000,
        positionClass: 'toast-bottom-right',
      }).onHidden.subscribe(() => {
        this.afterLogin();            
      });
    })
    .catch((err) => {
      let errString = err.error.message || JSON.stringify(err);
      this.toastr.warning(errString,"Erreur",{
        timeOut: 5000,
        positionClass: 'toast-bottom-right'
      });
      console.log(err);
    });
  }
}
