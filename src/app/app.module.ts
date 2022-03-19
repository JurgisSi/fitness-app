import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { Routes, RouterModule } from "@angular/router";

import { Store } from "store";

// feature modules

// containers
import { AppComponent } from "./containers/app/app.component";

// components

// routes
export const ROUTES: Routes = [];

@NgModule({
  imports: [BrowserModule, RouterModule.forRoot(ROUTES)],
  declarations: [AppComponent],
  providers: [Store],
  bootstrap: [AppComponent],
})
export class AppModule {}

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyBPQ6ChNveXPRUrqhlOk9hz-AqgfxMVnC8",
//   authDomain: "fitness-app-e0fd2.firebaseapp.com",
//   databaseURL: "https://fitness-app-e0fd2-default-rtdb.europe-west1.firebasedatabase.app",
//   projectId: "fitness-app-e0fd2",
//   storageBucket: "fitness-app-e0fd2.appspot.com",
//   messagingSenderId: "294328808147",
//   appId: "1:294328808147:web:48cffa5c4cc1570e735a26",
//   measurementId: "G-VT4B4D7ZXB"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
