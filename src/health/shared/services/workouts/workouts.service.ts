import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { filter, map, Observable, of, switchMap, take, tap } from "rxjs";
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
  uid: string;

  workouts$: Observable<Workout[]> = this.authService.user.pipe(
    take(1),
    switchMap((user) => {
      this.uid = user.uid;
      return this.db
        .list<any>(`workouts/${this.uid}`)
        .snapshotChanges()
        .pipe(
          map((res) =>
            res.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
          )
        );
    }),
    tap((workouts) => {
      this.store.set("workouts", workouts);
    })
  );

  constructor(
    private store: Store,
    private db: AngularFireDatabase,
    private authService: AuthService
  ) {}

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
