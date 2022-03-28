import { Component, OnDestroy, OnInit } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { Store } from "store";
import { ScheduleService } from "../../../shared/services/schedule/schedule.service";

@Component({
  selector: "schedule",
  styleUrls: ["schedule.component.scss"],
  template: `
    <div class="schedule">
      <schedule-calendar [date]="date$ | async"></schedule-calendar>
    </div>
  `,
})
export class ScheduleComponent implements OnInit, OnDestroy {
  date$: Observable<Date>;
  subscriptions: Subscription[] = [];

  constructor(private scheduleService: ScheduleService, private store: Store) {}

  ngOnInit(): void {
    this.date$ = this.store.select<Date>("date");

    this.subscriptions = [this.scheduleService.schedule$.subscribe()];
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
