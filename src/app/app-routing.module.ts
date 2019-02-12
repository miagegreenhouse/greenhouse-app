import { RegisterComponent } from './component/register/register.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConnexionComponent } from './component/connexion/connexion/connexion.component'
import { 
  AuthenticationService as AuthGuard 
} from './services/authentication/authentication.service';
import { AlertViewerComponent } from './component/alert-viewer/alert-viewer.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule'
  },
  {
    path: 'list',
    loadChildren: './list/list.module#ListPageModule'
  },
  {
    path: 'connexion',
    component: ConnexionComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'preferences',
    loadChildren: './preferences/preferences.module#PreferencesPageModule',
    canActivate: [AuthGuard]
  },
  { 
    path: 'alert',
    component: AlertViewerComponent 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
