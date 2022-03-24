import { Component } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../../shared/services/auth/auth.service";

@Component({
  selector: "login",
  template: `
    <div>
      <auth-form (submitted)="loginUser($event)">
        <h1>Login</h1>
        <a routerLink="/auth/register">Not registred?</a>
        <button type="submit">Login</button>
        <div class="error" *ngIf="error">
          {{ error }}
        </div>
      </auth-form>
    </div>
  `,
})
export class LoginComponent {
  error: string | undefined;

  constructor(private authService: AuthService, private router: Router) {}

  async loginUser(event: FormGroup) {
    const { email, password } = event.value;
    await this.authService
      .loginUser(email, password)
      .catch((err) => (this.error = err.message));
    this.router.navigate(["/"]);
  }
}
