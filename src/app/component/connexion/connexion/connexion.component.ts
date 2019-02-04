import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { UserForm } from 'src/app/model';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.scss']
})
export class ConnexionComponent implements OnInit {

  userForm : UserForm = {email:"",password:""};

  constructor(public auth : AuthenticationService) { }

  ngOnInit() {
  }

  login(login: string, password: string){
        this.auth.login(this.userForm)
        .then((user) => {
          console.log("here");
        })
        .catch((err) => {
          console.log(err);
        });
  }
}
