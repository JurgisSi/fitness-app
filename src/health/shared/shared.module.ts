import { CommonModule } from "@angular/common";
import { ModuleWithProviders, NgModule } from "@angular/core";
import { AngularFireDatabaseModule } from "@angular/fire/compat/database";
import { RouterModule } from "@angular/router";
import { JoinPipe } from "./pipes/join.pipe";
import { WorkoutPipe } from "./pipes/workout.pipe";
import { ListItemComponent } from "./services/components/list-item/list-item.component";
import { MealsService } from "./services/meals/meals.service";
import { WorkoutsService } from "./services/workouts/workouts.service";

@NgModule({
  imports: [CommonModule, RouterModule, AngularFireDatabaseModule],
  declarations: [ListItemComponent, JoinPipe, WorkoutPipe],
  exports: [ListItemComponent, JoinPipe, WorkoutPipe],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<any> {
    return {
      ngModule: SharedModule,
      providers: [MealsService, WorkoutsService],
    };
  }
}
