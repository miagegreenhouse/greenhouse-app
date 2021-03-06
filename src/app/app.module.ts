import { SocketService, WebSocketProtocol } from './services/socket/socket.service';
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
import { AuthenticationService } from './services/authentication/authentication.service';
import { ConnexionComponent } from './component/connexion/connexion/connexion.component';
import { RegisterComponent } from './component/register/register.component';
import { HttpClientModule } from '@angular/common/http';
import 'chartjs-plugin-annotation';
import { PreferencesPageModule } from './preferences/preferences.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {DataService} from './services/data/data.service';
import { AlertViewerComponent } from './component/alert-viewer/alert-viewer.component';


export function initApp(configService: ConfigService, restService: RestService, socketService: SocketService) {
  return () => {
    return new Promise((resolve, reject) => {
      configService.load()
          .then(() => {
            restService.loadFromAppConfig(configService.appConfig);
            let wsMethod = configService.appConfig.method.indexOf('https') !== -1 ? WebSocketProtocol.WSS : WebSocketProtocol.WS;
            socketService.initSocket(wsMethod, configService.appConfig.host, (err) => {
              console.error(err);
            });
            resolve();
          })
          .catch(reject);
    });
  };
}

@NgModule({
  declarations: [AppComponent, ConnexionComponent, RegisterComponent,AlertViewerComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    BrowserAnimationsModule,
    PreferencesPageModule,
    ToastrModule.forRoot()
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ToastService,
    StorageService,
    ConfigService,
    RestService,
    DataService,
    SocketService,
    AuthenticationService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      deps: [ConfigService, RestService, SocketService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
