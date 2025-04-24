import {Recipe} from "../models/recipe.model";
import {Ingredient} from "../models/ingredient.model";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Subject, Subscription, tap} from "rxjs";
import {ShoppingListService} from "./shopping-list.service";

@Injectable()
export class RecipeService{
  recipesChanged = new Subject<Recipe[]>();
  constructor(private httpClient: HttpClient,
              private slService: ShoppingListService) {
  }
  subscription: Subscription;
  url = 'http://localhost:5099/';
  recipes: Recipe[] = [
/*    new Recipe(
      'Margarita',
      'Pizza topped with our herb-infused signature pan sauce and 100% mozzarella cheese. A classic treat for all cheese lovers out there!',
      'https://i.guim.co.uk/img/media/794dcaf94ad82a45ac1f288f79c062040346bd76/0_202_4288_2573/master/4288.jpg?width=1200&quality=85&auto=format&fit=max&s=5ce547caf726fc8445fbdf2f34e20809',
      [
        new Ingredient(new IngredientIdentity('Cheese'),2),
        new Ingredient(new IngredientIdentity('Tomatoes'),3),
        new Ingredient(new IngredientIdentity('Bread'),1),
        new Ingredient(new IngredientIdentity('Garlic'),1),
      ]
    )*/
  ];

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
