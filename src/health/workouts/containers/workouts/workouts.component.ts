import { Component, OnDestroy, OnInit } from "@angular/core";
import { of, tap } from "rxjs";
import { from, Observable, Subscription } from "rxjs";
import {
  Workout,
  WorkoutsService,
} from "../../../shared/services/workouts/workouts.service";
import { Store } from "store";

@Component({
  selector: "workouts",
  styleUrls: ["workouts.component.scss"],
  template: `
    <div class="workouts">
      <div class="workouts__title">
        <h1>
          <img src="/assets/img/workout.svg" alt="workout" />
          Your workouts
        </h1>
        <a class="btn__add" [routerLink]="['../workouts/new']">
          <img src="/assets/img/add-white.svg" alt="add" />
          New Workout
        </a>
      </div>
      <div *ngIf="workouts$ | async as workouts; else loading">
        <div class="message" *ngIf="!workouts.length">
          <img src="/assets/img/face.svg" alt="face" />
          No workouts, add a new workout to start
        </div>
        <list-item
          *ngFor="let workout of workouts"
          [item]="workout"
          (remove)="removeWorkout($event)"
        ></list-item>
      </div>
      <ng-template #loading>
        <div class="message">
          <img src="/assets/img/loading.svg" alt="loading" /> Fetching
          workouts...
        </div>
      </ng-template>
    </div>
  `,
})
export class WorkoutsComponent implements OnInit, OnDestroy {
  workouts$: Observable<Workout[]>;
  subscription: Subscription = new Subscription();

  constructor(private workoutsService: WorkoutsService, private store: Store) {}

  ngOnInit(): void {
    this.workouts$ = this.store.select<Workout[]>("workouts");
    this.subscription = this.workoutsService.workouts$.subscribe();
  }

  removeWorkout(workout: Workout) {
    this.workoutsService.removeWorkout(workout.key);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
