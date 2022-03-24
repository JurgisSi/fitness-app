import { Component, OnDestroy, OnInit } from "@angular/core";
import { of } from "rxjs";
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
    <div>
      {{ meals$ | async | json }}
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
