import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { AngularFireDatabaseModule } from "@angular/fire/compat/database";
import { SharedModule } from "./shared/shared.module";

export const ROUTES: Routes = [
  {
    path: "auth",
    children: [
      { path: "", pathMatch: "full", redirectTo: "login" },
      {
        path: "login",
        loadChildren: () =>
          import("./login/login.module").then((m) => m.LoginModule),
      },
      {
        path: "register",
        loadChildren: () =>
          import("./register/register.module").then((m) => m.RegisterModule),
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
