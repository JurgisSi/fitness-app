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
  withLatestFrom,
} from "rxjs";
import { AuthService } from "../../../../auth/shared/services/auth/auth.service";
import { Store } from "store";
import { Meal } from "../meals/meals.service";
import { Workout } from "../workouts/workouts.service";

export interface ScheduleItem {
  meals?: Meal[];
  workouts?: Workout[];
  section?: string;
  timestamp?: number;
  key?: string;
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
  uid: string;

  private date$ = new BehaviorSubject<Date>(new Date());
  private section$ = new Subject();
  private itemList$ = new Subject();

  items$ = this.itemList$.pipe(
    withLatestFrom(this.section$),
    map(([items, section]: any[]) => {
      const id = section.data.key;

      const defaults: ScheduleItem = {
        workouts: null,
        meals: null,
        section: section.section,
        timestamp: new Date(section.day).getTime(),
      };

      const payload = {
        ...(id ? section.data : defaults),
        ...items,
      };

      if (id) {
        return this.updateSection(id, payload);
      } else {
        return this.createSection(payload);
      }
    })
  );

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

  updateItems(items: string[]) {
    this.itemList$.next(items);
  }

  private getSchedule(startAt: number, endAt: number) {
    return this.authService.user.pipe(
      take(1),
      switchMap((user) => {
        this.uid = user.uid;
        return this.db
          .list<any>(`schedule/${this.uid}`, (ref) =>
            ref.orderByChild("timestamp").startAt(startAt).endAt(endAt)
          )
          .snapshotChanges()
          .pipe(
            map((res) =>
              res.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
            )
          );
      })
    );
  }

  private createSection(payload: ScheduleItem) {
    return this.db.list(`schedule/${this.uid}`).push(payload);
  }

  private updateSection(key: string, payload: ScheduleItem) {
    return this.db.object(`schedule/${this.uid}/${key}`).update(payload);
  }
}
