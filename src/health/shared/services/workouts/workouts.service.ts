import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { filter, map, Observable, of, take } from "rxjs";
import { Store } from "store";
import { AuthService } from "../../../../auth/shared/services/auth/auth.service";

export interface Workout {
  name?: string;
  type?: string;
  strength?: any;
  endurance?: any;
  timestamp?: number;
  key?: string;
}

@Injectable()
export class WorkoutsService {
  workouts$: Observable<Workout[]> = of();
  uid: string;

  constructor(
    private store: Store,
    private db: AngularFireDatabase,
    private authService: AuthService
  ) {
    this.authService.user.pipe(take(1)).subscribe((user) => {
      this.uid = user.uid;
      this.workouts$ = this.db
        .list<any>(`workouts/${this.uid}`)
        .snapshotChanges()
        .pipe(
          map((res) =>
            res.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
          )
        );
      this.workouts$.subscribe((workouts) => {
        this.store.set("workouts", workouts);
      });
    });
  }

  getWorkout(key: string): Observable<Workout> {
    if (!key) {
      return of({});
    }
    return this.store.select<Workout[]>("workouts").pipe(
      filter(Boolean),
      map((workouts) => {
        return workouts.find((workout: Workout) => workout.key === key);
      })
    );
  }

  addWorkout(workouts: Workout) {
    return this.db.list(`workouts/${this.uid}`).push(workouts);
  }

  removeWorkout(key: string) {
    return this.db.list(`workouts/${this.uid}`).remove(key);
  }

  updateWorkout(key: string, workouts: Workout) {
    return this.db.object(`workouts/${this.uid}/${key}`).update(workouts);
  }
}
