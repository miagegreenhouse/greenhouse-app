import { User, UserForm } from './../../model/index';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  public currentUser: User;

  constructor(
    public restService
  ) { }

  login(userForm: UserForm) {
    return new Promise((resolve, reject) => {
      this.restService.login(userForm).then((user) => {
        this.currentUser = user;
        resolve(user);
      })
      .catch(reject);
    });
  }

  getCurrentUser() {
    return this.currentUser;
  }

  logout() {
    this.currentUser = undefined;
  }

}
