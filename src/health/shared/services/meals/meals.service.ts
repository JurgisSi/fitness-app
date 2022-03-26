import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { map, Observable, of, take } from "rxjs";
import { Store } from "store";
import { AuthService } from "../../../../auth/shared/services/auth/auth.service";

export interface Meal {
  name: string;
  ingrdients: string[];
  timestamp: number;
  key: string;
  $exists: () => boolean;
}

@Injectable()
export class MealsService {
  meals$: Observable<Meal[]> = of();
  uid: string;

  constructor(
    private store: Store,
    private db: AngularFireDatabase,
    private authService: AuthService
  ) {
    this.authService.user.pipe(take(1)).subscribe((user) => {
      this.uid = user.uid;
      this.meals$ = this.db
        .list<any>(`meals/${this.uid}`)
        .snapshotChanges()
        .pipe(
          map((res) =>
            res.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
          )
        );
      this.meals$.subscribe((meals) => {
        this.store.set("meals", meals);
      });
    });
  }

  addMeal(meal: Meal) {
    return this.db.list(`meals/${this.uid}`).push(meal);
  }

  removeMeal(key: string) {
    return this.db.list(`meals/${this.uid}`).remove(key);
  }
}
