import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AngularFireModule, FirebaseAppConfig } from "angularfire2";
import { AngularFireAuthModule } from "angularfire2/auth";
import { AngularFireDatabaseModule } from "angularfire2/database";
import { SharedModule } from "./shared/shared.module";

export const ROUTES: Routes = [
  {
    path: "auth",
    children: [
      { path: "", pathMatch: "full", redirectTo: "login" },
      { path: "login", loadChildren: "./login/login.module#LoginModule" },
      {
        path: "register",
        loadChildren: "./register/register.module#RegisterModule",
      },
    ],
  },
];

export const firebaseConfig = {
  apiKey: "AIzaSyBPQ6ChNveXPRUrqhlOk9hz-AqgfxMVnC8",
  authDomain: "fitness-app-e0fd2.firebaseapp.com",
  databaseURL:
    "https://fitness-app-e0fd2-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "fitness-app-e0fd2",
  storageBucket: "fitness-app-e0fd2.appspot.com",
  messagingSenderId: "294328808147",
  appId: "1:294328808147:web:48cffa5c4cc1570e735a26",
  measurementId: "G-VT4B4D7ZXB",
};

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    SharedModule.forRoot(),
  ],
  declarations: [],
  providers: [],
})
export class AuthModule {}
