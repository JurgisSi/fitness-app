import { Pipe, PipeTransform } from "@angular/core";
import { Workout } from "../services/workouts/workouts.service";

@Pipe({
  name: "workout",
})
export class WorkoutPipe implements PipeTransform {
  transform(value: Workout) {
    if (value.type === "endurance") {
      return `Distance: ${value.endurance.distance + "km"}, Duration: ${
        value.endurance.duration + "mins"
      }`;
    } else {
      return `Weight: ${value.strength.weight + "kg"}, Reps: ${
        value.strength.reps
      }, Sets: ${value.strength.sets}`;
    }
  }
}
