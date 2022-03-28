import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import {
  BehaviorSubject,
  map,
  Observable,
  tap,
  switchMap,
  take,
  Subject,
} from "rxjs";
import { AuthService } from "../../../../auth/shared/services/auth/auth.service";
import { Store } from "store";
import { Meal } from "../meals/meals.service";
import { Workout } from "../workouts/workouts.service";

export interface ScheduleItem {
  meals: Meal[];
  workouts: Workout[];
  section: string;
  timestamp: number;
  $key?: string;
}

export interface ScheduleList {
  morning?: ScheduleItem;
  lunch?: ScheduleItem;
  evening?: ScheduleItem;
  snacks?: ScheduleItem;
  [key: string]: any;
}

@Injectable()
export class ScheduleService {
  private date$ = new BehaviorSubject<Date>(new Date());
  private section$ = new Subject();

  selected$ = this.section$.pipe(
    tap((section) => this.store.set("selected", section))
  );

  list$ = this.section$.pipe(
    map((value: any) => this.store.value[value.type]),
    tap((value) => this.store.set("list", value))
  );

  schedule$: Observable<ScheduleList> = this.date$.pipe(
    tap((date) => this.store.set("date", date)),
    map((day) => {
      const startAt = new Date(
        day.getFullYear(),
        day.getMonth(),
        day.getDate()
      ).getTime();
      const endAt =
        new Date(
          day.getFullYear(),
          day.getMonth(),
          day.getDate() + 1
        ).getTime() - 1;
      return { startAt, endAt };
    }),
    switchMap(({ startAt, endAt }: any) => this.getSchedule(startAt, endAt)),
    map((data: any) => {
      const mapped: ScheduleList = {};
      for (const prop of data) {
        if (!mapped[prop.section]) {
          mapped[prop.section] = prop;
        }
      }
      return mapped;
    }),
    tap((schedule) => this.store.set("schedule", schedule))
  );

  constructor(
    private store: Store,
    private db: AngularFireDatabase,
    private authService: AuthService
  ) {}

  updateDate(date: Date) {
    this.date$.next(date);
  }

  selectSection(event: any) {
    this.section$.next(event);
  }

  private getSchedule(startAt: number, endAt: number) {
    return this.authService.user.pipe(
      take(1),
      switchMap((user) => {
        return this.db
          .list(`schedule/${user.uid}`, (ref) =>
            ref.orderByChild("timestamp").startAt(startAt).endAt(endAt)
          )
          .snapshotChanges();
      })
    );
  }
}
