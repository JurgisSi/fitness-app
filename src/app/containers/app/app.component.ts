import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  AuthService,
  User,
} from "../../../auth/shared/services/auth/auth.service";
import { Store } from "store";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import { Router } from "@angular/router";

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
export class AppComponent implements OnInit, OnDestroy {
  user$: Observable<User>;
  subscription: Subscription;

  constructor(
    private store: Store,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscription = this.authService.auth$.subscribe();
    this.user$ = this.store.select<User>("user");
  }

  async onLogout() {
    await this.authService.logoutUser();
    this.router.navigate(["/auth/login"]);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
