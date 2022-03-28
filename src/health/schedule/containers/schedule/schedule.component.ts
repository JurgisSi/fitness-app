import { Component, OnDestroy, OnInit } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import {
  Meal,
  MealsService,
} from "../../../shared/services/meals/meals.service";
import {
  Workout,
  WorkoutsService,
} from "../../../shared/services/workouts/workouts.service";
import { Store } from "store";
import {
  ScheduleItem,
  ScheduleService,
} from "../../../shared/services/schedule/schedule.service";

@Component({
  selector: "schedule",
  styleUrls: ["schedule.component.scss"],
  template: `
    <div class="schedule">
      <schedule-calendar
        [date]="date$ | async"
        [items]="schedule$ | async"
        (change)="changeDate($event)"
        (select)="changeSection($event)"
      ></schedule-calendar>
      <schedule-assign
        *ngIf="open"
        [section]="selected$ | async"
        [list]="list$ | async"
        (update)="assignItem($event)"
        (cancel)="closeAssign()"
      >
      </schedule-assign>
    </div>
  `,
})
export class ScheduleComponent implements OnInit, OnDestroy {
  open = false;

  date$: Observable<Date>;
  schedule$: Observable<ScheduleItem[]>;
  selected$: Observable<any>;
  list$: Observable<Meal[] | Workout[]>;

  subscriptions: Subscription[] = [];

  constructor(
    private scheduleService: ScheduleService,
    private store: Store,
    private mealsService: MealsService,
    private workoutsService: WorkoutsService
  ) {}

  ngOnInit(): void {
    this.date$ = this.store.select<Date>("date");
    this.schedule$ = this.store.select<ScheduleItem[]>("schedule");
    this.selected$ = this.store.select<any>("selected");
    this.list$ = this.store.select<Meal[] | Workout[]>("list");

    this.subscriptions = [
      this.scheduleService.schedule$.subscribe(),
      this.scheduleService.selected$.subscribe(),
      this.scheduleService.list$.subscribe(),
      this.scheduleService.items$.subscribe(),
      this.mealsService.meals$.subscribe(),
      this.workoutsService.workouts$.subscribe(),
    ];
  }

  changeDate(date: Date) {
    this.scheduleService.updateDate(date);
  }

  changeSection(event: any) {
    this.open = true;
    this.scheduleService.selectSection(event);
  }

  assignItem(items: string[]) {
    this.scheduleService.updateItems(items);
    this.closeAssign();
  }

  closeAssign() {
    this.open = false;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
