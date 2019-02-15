import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StorageService } from './../../services/storage/storage.service';
import { DataService } from './../../services/data/data.service';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService, OAuthToken } from '../../services/authentication/authentication.service';
import { UserRegistrationForm } from 'src/app/model';
import { ToastrService } from 'ngx-toastr'; 
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm : FormGroup;
  adminForm : UserRegistrationForm = {email:"",password:"", confirmPassword: ""};
  redirect : string = '';

  constructor(
    public auth : AuthenticationService, 
    private toastr: ToastrService, 
    private router: Router, 
    private route: ActivatedRoute, 
    public dataService: DataService,
    public storageService: StorageService,
    public formBuilder: FormBuilder
  ) { }
    
  ngOnInit() {
    this.route.queryParams.subscribe(
      params => {
        if (params.redirect) {
          this.redirect = params.redirect;
        }
      }
    );
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
        validator: MustMatch('password', 'confirmPassword')
    });
  }

  afterLogin() {
    if (!this.redirect) {
      this.router.navigate(['home']);
    } else {
      this.router.navigateByUrl(this.redirect);
    }
  }

  register() {
    const adminForm = {
      email: this.registerForm.get('email').value,
      password: this.registerForm.get('password').value,
      confirmPassword: this.registerForm.get('confirmPassword').value
    };
    this.dataService.createAdmin(adminForm)
    .subscribe((token: OAuthToken) => {
      if (token.access_token) {
        this.storageService.set("access_token", {
          value: token.access_token
        });
        this.dataService.addMail(adminForm.email)
        .subscribe(res => {
          this.auth.login()
          .then(user => {
            this.dataService.initData();
            this.toastr.success("Vous êtes connecté avec : "+user.email,"Succès",{
              timeOut: 2000,
              positionClass: 'toast-bottom-right',
            }).onHidden.subscribe(() => {
              this.afterLogin();            
            });
          })
          .catch(err => {
            let errString = err.error.message || JSON.stringify(err);
            this.toastr.warning(errString,"Erreur",{
              timeOut: 5000,
              positionClass: 'toast-bottom-right'
            });
            console.error(err);
          });
        }, err => {
          this.toastr.warning("The server could not create the email","Erreur",{
            timeOut: 5000,
            positionClass: 'toast-bottom-right'
          });
        });
      } else {
        this.toastr.warning("The server could not create this user","Erreur",{
          timeOut: 5000,
          positionClass: 'toast-bottom-right'
        });
        console.error({message: "The server could not create this user"});
      }
    }, err => {
      let errString = err.error.message || JSON.stringify(err);
      this.toastr.warning(errString,"Erreur",{
        timeOut: 5000,
        positionClass: 'toast-bottom-right'
      });
      console.error(err);
    });
  }

}

export function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
          // return if another validator has already found an error on the matchingControl
          return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
          matchingControl.setErrors({ mustMatch: true });
      } else {
          matchingControl.setErrors(null);
      }
  }
}