import { Component, OnDestroy, OnInit } from "@angular/core";
import { of, tap } from "rxjs";
import { from, Observable, Subscription } from "rxjs";
import { Store } from "store";
import {
  Meal,
  MealsService,
} from "../../../shared/services/meals/meals.service";

@Component({
  selector: "meals",
  styleUrls: ["meals.component.scss"],
  template: `
    <div class="meals">
      <div class="meals__title">
        <h1>
          <img src="/assets/img/food.svg" alt="food" />
          Your meals
        </h1>
        <a class="btn__add" [routerLink]="['../meals/new']">
          <img src="/assets/img/add-white.svg" alt="add" />
          New meal
        </a>
      </div>
      <div *ngIf="meals$ | async as meals; else loading">
        <div class="message" *ngIf="!meals.length">
          <img src="/assets/img/face.svg" alt="face" />
          No meals, add a new meal to start
        </div>
        <list-item
          *ngFor="let meal of meals"
          [item]="meal"
          (remove)="removeMeal($event)"
        ></list-item>
      </div>
      <ng-template #loading>
        <div class="message">
          <img src="/assets/img/loading.svg" alt="loading" /> Fetching meals...
        </div>
      </ng-template>
    </div>
  `,
})
export class MealsComponent implements OnInit, OnDestroy {
  meals$: Observable<Meal[]>;
  subscription: Subscription = new Subscription();

  constructor(private mealsService: MealsService, private store: Store) {}

  ngOnInit(): void {
    this.meals$ = this.store.select<Meal[]>("meals");
    this.subscription = this.mealsService.meals$.subscribe();
  }

  removeMeal(meal: Meal) {
    this.mealsService.removeMeal(meal.key);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
