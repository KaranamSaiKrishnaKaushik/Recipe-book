import {Recipe} from "../models/recipe.model";
import {Ingredient} from "../models/ingredient.model";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable, Subject, Subscription, tap} from "rxjs";
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

  addAllRecipes(recipes: Recipe[]){
   return this.httpClient
      .post(this.url + 'add-all-recipes', recipes)
      .pipe(
        tap(()=>{
          this.fetchRecipesFromDataSource()
        })
      )
      // .subscribe(response=>{
      //   console.log(response);
      // });
  }

  updateRecipe(recipe: Recipe){
    this.httpClient
      .post(this.url + 'update-recipe', recipe)
      .pipe(
        tap(()=>{
          this.fetchRecipesFromDataSource()
        })
      )
      .subscribe(response=>{
        console.log(response);
      });
  }

  // addAllRecipe(recipes: Recipe[]) {
  //   return this.httpClient.post(`${this.url}add-multiple-recipes`, recipes);
  // }

  deleteRecipe(recipeId: string){
    const currentIndex = this.recipes.findIndex(r => r.id === recipeId);
    this.httpClient
      .delete(`${this.url}delete-recipe/${recipeId}`)
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
      console.log('recipes: ', recipes)
       this.recipes = recipes;
       this.recipesChanged.next(this.recipes);
     });
    return this.recipes.slice();
  }

  getAllRecipesFromDataSource(): Observable<Recipe[]> {
    return this.httpClient
      .get<Recipe[]>(this.url + 'fetch-all-recipes')
      .pipe(
        tap(recipes => {
          this.recipes = recipes;
          this.recipesChanged.next(this.recipes);
        })
      );
  }
  

  addIngredientsToShoppingList(ingredients: Ingredient[]){
    this.slService.addMultipleIngredientsToList(ingredients);
  }

}
