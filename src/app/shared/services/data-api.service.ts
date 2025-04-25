import {Injectable} from "@angular/core";
import {ShoppingListService} from "./shopping-list.service";
import {RecipeService} from "./recipe.service";
import {Ingredient} from "../models/ingredient.model";
import {Recipe} from "../models/recipe.model";
import {BehaviorSubject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import { environment } from 'src/environments/environment';

@Injectable()
export class DataApiService {
  constructor(private httpClient: HttpClient,
              private slService: ShoppingListService,
              private recipeService: RecipeService) {
  }
  url = environment.apiUrl; //'http://localhost:5099/';
  recipes: Recipe[] = [];
  ingredients: Ingredient[];
  private ingredientsSubject = new BehaviorSubject<Ingredient[]>([]);
  ingredient$ = this.ingredientsSubject.asObservable();

  saveRecipes() {

  }

  fetchRecipes() {

  }

  addNewRecipe() {

  }

  addSingleIngredientToList() {

  }

  addMultipleIngredientsToList() {

  }

  updateSingleIngredient() {

  }

  getAllIngredients() {
    this.httpClient.get<Ingredient[]>(this.url+'ingredients').subscribe((ingredients) => {
      this.ingredientsSubject.next(ingredients);
    });
  }
}
