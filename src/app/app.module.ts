import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { ToastService } from './services/toast/toast.service';
import { StorageService } from './services/storage/storage.service';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ConnexionComponent } from './component/connexion/connexion/connexion.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent, ConnexionComponent],
  entryComponents: [],
    imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule
    ],
  providers: [
    StatusBar,
    SplashScreen,
    ToastService,
    StorageService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
