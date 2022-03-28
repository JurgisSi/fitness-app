import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { filter, map, Observable, of, switchMap, take, tap } from "rxjs";
import { Store } from "store";
import { AuthService } from "../../../../auth/shared/services/auth/auth.service";

export interface Meal {
  name?: string;
  ingredients?: string[];
  timestamp?: number;
  key?: string;
}

@Injectable()
export class MealsService {
  uid: string;

  meals$: Observable<Meal[]> = this.authService.user.pipe(
    take(1),
    switchMap((user) => {
      this.uid = user.uid;
      return this.db
        .list<any>(`meals/${this.uid}`)
        .snapshotChanges()
        .pipe(
          map((res) =>
            res.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
          )
        );
    }),
    tap((meals) => {
      this.store.set("meals", meals);
    })
  );

  constructor(
    private store: Store,
    private db: AngularFireDatabase,
    private authService: AuthService
  ) {}

  getMeal(key: string): Observable<Meal> {
    if (!key) {
      return of({});
    }
    return this.store.select<Meal[]>("meals").pipe(
      filter(Boolean),
      map((meals) => {
        return meals.find((meal: Meal) => meal.key === key);
      })
    );
  }

  addMeal(meal: Meal) {
    return this.db.list(`meals/${this.uid}`).push(meal);
  }

  removeMeal(key: string) {
    return this.db.list(`meals/${this.uid}`).remove(key);
  }

  updateMeal(key: string, meal: Meal) {
    return this.db.object(`meals/${this.uid}/${key}`).update(meal);
  }
}
