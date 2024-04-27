import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireModule } from '@angular/fire/compat';
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    AngularFireStorageModule,
    AngularFireModule.initializeApp({"projectId":"pps-apps-fd147",
    "appId":"1:124008798513:web:0287384874d68874b0f810",
    "storageBucket":"pps-apps-fd147.appspot.com",
    "apiKey":"AIzaSyB-gvshrILsOwxleRo_5CBvtk-w4qDIxxE",
    "authDomain":"pps-apps-fd147.firebaseapp.com",
    "messagingSenderId":"124008798513"}),
    provideFirebaseApp(() => initializeApp({"projectId":"pps-apps-fd147",
    "appId":"1:124008798513:web:0287384874d68874b0f810",
    "storageBucket":"pps-apps-fd147.appspot.com",
    "apiKey":"AIzaSyB-gvshrILsOwxleRo_5CBvtk-w4qDIxxE",
    "authDomain":"pps-apps-fd147.firebaseapp.com",
    "messagingSenderId":"124008798513"})),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),

  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
