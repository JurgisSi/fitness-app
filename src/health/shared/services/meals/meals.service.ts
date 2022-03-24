import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { Observable, of, take } from "rxjs";
import { Store } from "store";
import { AuthService } from "../../../../auth/shared/services/auth/auth.service";

export interface Meal {
  name: string;
  ingrdients: string[];
  timestamp: number;
  $key: string;
  $exists: () => boolean;
}

@Injectable()
export class MealsService {
  meals$: Observable<Meal[]> = of();

  constructor(
    private store: Store,
    private db: AngularFireDatabase,
    private authService: AuthService
  ) {
    this.authService.user.pipe(take(1)).subscribe((user) => {
      this.meals$ = this.db.list<Meal>(`meals/${user.uid}`).valueChanges();

      this.meals$.subscribe((meals) => {
        this.store.set("meals", meals);
      });
    });
  }
}
