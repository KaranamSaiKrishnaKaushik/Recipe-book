import {Recipe} from "../models/recipe.model";
import {Ingredient} from "../models/ingredient.model";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Subject, Subscription, tap} from "rxjs";
import {ShoppingListService} from "./shopping-list.service";
import { environment } from 'src/environments/environment';

@Injectable()
export class RecipeService{
  recipesChanged = new Subject<Recipe[]>();
  constructor(private httpClient: HttpClient,
              private slService: ShoppingListService) {
  }
  subscription: Subscription;
  url = environment.apiUrl; //'http://localhost:5099/';
  private apiUrl = environment.apiUrl;
  recipes: Recipe[] = [];

  onInit(){
    this.fetchRecipesFromDataSource();
  }

  getRecipes(){
   return  this.fetchRecipesFromDataSource();
  }

  getRecipe(index: number){
    return  this.recipes.slice()[index];
  }

  addRecipe(recipe: Recipe){
    this.httpClient
      .post(this.url + 'add-recipe', recipe)
      .pipe(
        tap(()=>{
          this.fetchRecipesFromDataSource()
        })
      )
      .subscribe(response=>{
        console.log(response);
      });
  }

  fetchRecipesFromDataSource(){
    this.httpClient
      .get<Recipe[]>(this.url+'fetch-all-recipes')
     .subscribe(recipes=>{
       this.recipes = recipes;
       this.recipesChanged.next(this.recipes);
     });
    return this.recipes.slice();
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]){
    this.slService.addMultipleIngredientsToList(ingredients);
  }

}
