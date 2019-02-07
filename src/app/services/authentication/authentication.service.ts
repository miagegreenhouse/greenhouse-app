import { User, UserForm } from './../../model/index';
import { Injectable } from '@angular/core';
import { RestService } from '../rest/rest.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  public currentUser: User;

  constructor(
    public restService: RestService
  ) { }

  login(userForm: UserForm) {
    return new Promise((resolve, reject) => {
      this.restService.login(userForm).subscribe((user: User) => {
        this.currentUser = user;
        resolve(user);
      }, reject);
    });
  }

  getCurrentUser() {
    return this.currentUser;
  }

  logout() {
    this.currentUser = undefined;
  }

}
