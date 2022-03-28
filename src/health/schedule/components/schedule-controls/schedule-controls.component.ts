import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";

@Component({
  selector: "schedule-controls",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ["schedule-controls.component.scss"],
  template: `
    <div class="controls">
      <button type="button" (click)="moveDate(offset - 1)">
        <img src="/assets/img/chevron-left.svg" alt="chevron-left" />
      </button>
      <p>{{ selected | date: "y MMMM d" }}</p>
      <button type="button" (click)="moveDate(offset + 1)">
        <img src="/assets/img/chevron-right.svg" alt="chevron-right" />
      </button>
    </div>
  `,
})
export class ScheduleControlsComponent {
  @Input() selected: Date;
  @Output() move = new EventEmitter<number>();

  offset = 0;

  constructor() {}

  moveDate(offset: number) {
    this.offset = offset;
    this.move.emit(offset);
  }
}
