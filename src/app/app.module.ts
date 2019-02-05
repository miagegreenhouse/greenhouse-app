import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { ToastService } from './services/toast/toast.service';
import { StorageService } from './services/storage/storage.service';
import { ConfigService } from './services/config/config.service';
import { RestService } from './services/rest/rest.service';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthenticationService } from'./services/authentication/authentication.service'
import { ConnexionComponent } from './component/connexion/connexion/connexion.component';
import { HttpClientModule } from '@angular/common/http';

export function initApp(configService: ConfigService, restService: RestService) {
  return () => {
    return new Promise((resolve, reject) => {
      configService.load()
      .then(() => {
        restService.loadFromAppConfig(configService.appConfig);
        resolve();
      })
      .catch(reject);
    });
  }
};
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [AppComponent, ConnexionComponent],
  entryComponents: [],
    imports: [
    BrowserModule,
    FormsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
    ],
  providers: [
    StatusBar,
    SplashScreen,
    ToastService,
    StorageService,
    ConfigService,
    RestService,
    AuthenticationService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      deps: [ConfigService, RestService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
