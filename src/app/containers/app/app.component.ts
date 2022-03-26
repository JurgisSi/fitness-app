import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { Store } from "store";
import {
  AuthService,
  User,
} from "../../../auth/shared/services/auth/auth.service";

@Component({
  selector: "app-root",
  styleUrls: ["app.component.scss"],
  template: `
    <div>
      <app-header [user]="user$ | async" (logout)="onLogout()"></app-header>
      <app-nav *ngIf="(user$ | async)?.authenticated"></app-nav>
      <div class="wrapper">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
})
export class AppComponent implements OnInit {
  user$: Observable<User>;

  constructor(
    private store: Store,
    private authService: AuthService,
    private router: Router
  ) {
    this.user$ = this.store.select<User>("user");
  }

  ngOnInit(): void {}

  async onLogout() {
    await this.authService.logoutUser();
    this.router.navigate(["/auth/login"]);
  }
}
