import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, of, Subscription, switchMap } from "rxjs";
import {
  Meal,
  MealsService,
} from "../../../shared/services/meals/meals.service";

@Component({
  selector: "meal",
  styleUrls: ["meal.component.scss"],
  template: `
    <div class="meal">
      <div class="meal__title">
        <h1>
          <img src="/assets/img/food.svg" alt="food" />
          <span *ngIf="meal$ | async as meal; else title">
            {{ meal.name ? "Edit" : "Create" }} meal</span
          >
          <ng-template #title> Loading... </ng-template>
        </h1>
      </div>
      <div *ngIf="meal$ | async as meal; else loading">
        <meal-form
          (create)="addMeal($event)"
          [meal]="meal"
          (update)="updateMeal($event)"
          (remove)="removeMeal($event)"
        ></meal-form>
      </div>
      <ng-template #loading>
        <div class="message">
          <img src="/assets/img/loading.svg" alt="loading" />
          Fetching meal...
        </div>
      </ng-template>
    </div>
  `,
})
export class MealComponent implements OnInit, OnDestroy {
  meal$: Observable<Meal>;
  subscription: Subscription;

  constructor(
    private mealsService: MealsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.subscription = this.mealsService.meals$.subscribe();
    this.meal$ = this.route.params.pipe(
      switchMap((param) => this.mealsService.getMeal(param["id"]))
    );
  }

  async addMeal(event: Meal) {
    await this.mealsService.addMeal(event);
    this.backToMeals();
  }

  async updateMeal(event: Meal) {
    const key = this.route.snapshot.params["id"];
    await this.mealsService.updateMeal(key, event);
    this.backToMeals();
  }

  async removeMeal(event: Meal) {
    const key = this.route.snapshot.params["id"];
    this.mealsService.removeMeal(key);
    this.backToMeals();
  }

  backToMeals() {
    this.router.navigate(["meals"]);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
