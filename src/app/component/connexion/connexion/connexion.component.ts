import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { UserForm } from 'src/app/model';
import { User } from 'src/app/model';
import { ToastrService } from 'ngx-toastr'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.scss']
})
export class ConnexionComponent implements OnInit {

  userForm : UserForm = {email:"",password:""};

  constructor(public auth : AuthenticationService, private toastr: ToastrService, private router: Router) { }

  ngOnInit() {
  }

  login(){
        this.auth.login(this.userForm)
        .then((user: User) => {
          this.toastr.success("Vous êtes connecté avec : "+user.email,"Succès",{
            timeOut: 2000,
            positionClass: 'toast-bottom-right'
          });
        })
        .catch((err) => {
          this.toastr.warning(err,"Erreur",{
            timeOut: 5000,
            positionClass: 'toast-bottom-right'
          });
          console.log(err);
          //TODO : mettre ce code dans le then, pas dans le catch
          this.router.navigateByUrl('/preferences');
        });
  }
}
