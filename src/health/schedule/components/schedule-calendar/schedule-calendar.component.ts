import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "schedule-calendar",
  styleUrls: ["schedule-calendar.component.scss"],
  template: `
    <div class="calendar">
      <schedule-controls
        [selected]="selectedDay"
        (move)="onChange($event)"
      ></schedule-controls>
    </div>
  `,
})
export class ScheduleCalendarComponent {
  @Input() set date(date: Date) {
    this.selectedDay = new Date(date.getTime());
  }

  @Output() change = new EventEmitter<Date>();

  selectedDay: Date;

  constructor() {}

  onChange(weekOffset: number) {
    const startOfWeek = this.getStartOfTheWeek(new Date());
    const startDate = new Date(
      startOfWeek.getFullYear(),
      startOfWeek.getMonth(),
      startOfWeek.getDate()
    );
    startDate.setDate(startDate.getDate() + weekOffset * 7);

    this.change.emit(startDate);
  }

  private getStartOfTheWeek(date: Date): Date {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);

    return new Date(date.setDate(diff));
  }
}