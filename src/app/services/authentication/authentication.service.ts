import { StorageService } from './../storage/storage.service';
import { User, UserForm } from './../../model/index';
import { Injectable } from '@angular/core';
import { RestService } from '../rest/rest.service';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';

export interface OAuthToken {
  access_token: string,
  expires_in: number,
  token_type: string
};

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService implements CanActivate {

  public currentUser: User;

  constructor(
    public restService: RestService,
    public storageService: StorageService,
    public router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.login().then((user: User) => {
        if (user.email) {
          resolve(true);
        } else {
          reject(false);
          this.router.navigate(['connexion'], {queryParams: {
            redirect: state.url
          }});
        }
      }).catch(err => {
        reject(false);
        this.router.navigate(['connexion'], {queryParams: {
          redirect: state.url
        }});
      });
    });
  }

  login(userForm?: UserForm): Promise<User> {
    return new Promise((resolve, reject) => {
      if (userForm) {
        this.restService.login(userForm).subscribe((token: OAuthToken) => {
          if (token.access_token) {
            this.storageService.set("access_token", {
              value: token.access_token
            });
          } else {
            reject({message: "The server could not identify this user"});
          }
          this.restService.getMe().subscribe((user: User) => {
            this.currentUser = user;
            this.storageService.set('currentUser', user);
            console.log(user);
            resolve(user);
          }, reject);
        }, reject);
      } else if (this.currentUser) {
        resolve(this.currentUser);
      } else if (localStorage.getItem('access_token')) {
        this.restService.getMe().subscribe((user: User) => {
          this.currentUser = user;
          this.storageService.set('currentUser', user);
          console.log(user);
          resolve(user);
        }, reject);
      } else {
        reject();
      }
    });
  }

  getCurrentUser() {
    return this.currentUser;
  }

  logout() {
    this.currentUser = undefined;
    localStorage.removeItem('access_token');
    localStorage.removeItem('currentUser');
  }

}
