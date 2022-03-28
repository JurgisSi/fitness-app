import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from "@angular/core";
import { ScheduleItem } from "../../../shared/services/schedule/schedule.service";

@Component({
  selector: "schedule-calendar",
  styleUrls: ["schedule-calendar.component.scss"],
  template: `
    <div class="calendar">
      <schedule-controls
        [selected]="selectedDay"
        (move)="onChange($event)"
      ></schedule-controls>

      <schedule-days
        [selected]="selectedDayIndex"
        (select)="selectDay($event)"
      ></schedule-days>

      <schedule-section
        *ngFor="let section of sections"
        [name]="section.name"
        [section]="getSection(section.key)"
        (select)="selectSection($event, section.key)"
      ></schedule-section>
    </div>
  `,
})
export class ScheduleCalendarComponent implements OnChanges {
  @Input() set date(date: Date) {
    this.selectedDay = new Date(date.getTime());
  }

  @Input()
  items: ScheduleItem[];

  @Output()
  change = new EventEmitter<Date>();

  @Output()
  select = new EventEmitter<any>();

  selectedDay: Date;
  selectedWeek: Date;
  selectedDayIndex: number;

  sections = [
    { key: "morning", name: "Morning" },
    { key: "lunch", name: "Lunch" },
    { key: "evening", name: "Evening" },
    { key: "snacks", name: "Snacks and Drinks" },
  ];

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    this.selectedDayIndex = this.getToday(this.selectedDay);
    this.selectedWeek = this.getStartOfTheWeek(new Date(this.selectedDay));
  }

  getSection(name: string): ScheduleItem {
    return (this.items && this.items[name]) || {};
  }

  selectSection({ type, assigned, data }: any, section: string) {
    const day = this.selectedDay;
    this.select.emit({
      type,
      assigned,
      section,
      day,
      data,
    });
  }

  selectDay(index: number) {
    const selectedDay = new Date(this.selectedWeek);
    selectedDay.setDate(selectedDay.getDate() + index);
    this.change.emit(selectedDay);
  }

  getToday(date: Date): number {
    let today = date.getDay() - 1;
    if (today < 0) {
      today = 6;
    }
    return today;
  }

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
