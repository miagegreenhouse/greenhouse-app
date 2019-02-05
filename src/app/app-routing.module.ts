import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConnexionComponent } from './component/connexion/connexion/connexion.component'
import { PreferencesComponent } from './component/preferences/preferences/preferences.component'

const routes: Routes = [
  {
    path: '',
    redirectTo: 'connexion',
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
    path: 'preferences',
    component: PreferencesComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
