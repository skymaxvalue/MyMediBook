import { createFeatureSelector, createSelector } from "@ngrx/store";
import { NavigationState } from "./navigation.reducer";

export const selectNavigationState = createFeatureSelector<NavigationState>("patient");
