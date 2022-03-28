import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";

@Component({
  selector: "schedule-days",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ["schedule-days.component.scss"],
  template: `
    <div class="days">
      <button
        type="button"
        class="day"
        *ngFor="let day of days; let i = index"
        (click)="selectDay(i)"
      >
        <span [class.active]="i === selected">
          {{ day }}
        </span>
      </button>
    </div>
  `,
})
export class ScheduleDaysComponent {
  @Input() selected: number;

  @Output() select = new EventEmitter<number>();

  days = ["M", "T", "W", "T", "F", "S", "S"];

  constructor() {}

  selectDay(index: number) {
    this.select.emit(index);
  }
}
