import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { ScheduleControlsComponent } from "./components/schedule-controls/schedule-controls.component";
import { ScheduleDaysComponent } from "./components/schedule-days/schedule-days.component";
import { ScheduleCalendarComponent } from "./components/schedule-calendar/schedule-calendar.component";
import { ScheduleComponent } from "./containers/schedule/schedule.component";
import { ScheduleSectionComponent } from "./components/schedule-section/schedule-section.component";
import { SharedModule } from "../shared/shared.module";
import { ScheduleAssignComponent } from "./components/schedule-assign/schedule-assign.component";

export const ROUTES: Routes = [{ path: "", component: ScheduleComponent }];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(ROUTES),
    SharedModule,
  ],
  declarations: [
    ScheduleComponent,
    ScheduleCalendarComponent,
    ScheduleDaysComponent,
    ScheduleControlsComponent,
    ScheduleSectionComponent,
    ScheduleAssignComponent,
  ],
})
export class ScheduleModule {}
