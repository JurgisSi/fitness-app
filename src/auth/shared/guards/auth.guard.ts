import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { User } from "@firebase/auth";
import { map } from "rxjs";
import { AuthService } from "../services/auth/auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate() {
    return this.authService.authState.pipe(
      map((user: User) => {
        if (!user) {
          this.router.navigate(["/auth/login"]);
        }
        return !!user;
      })
    );
  }
}
