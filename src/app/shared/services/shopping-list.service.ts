import {Ingredient} from "../models/ingredient.model";
import {Injectable, OnInit} from "@angular/core";
import {Subject, Subscription, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class ShoppingListService implements OnInit {
  ingredientsChanged = new Subject<Ingredient[]>();
  ingredients: Ingredient[] = []
  startedEditing = new Subject<number>();
  constructor(private httpClient: HttpClient) {
  }

  subscription: Subscription;
  url = 'http://localhost:5099/';

  ngOnInit(): void {
    this.subscription = this.httpClient.get<Ingredient[]>(this.url + 'ingredients')
      .subscribe(
        (ingredients) => {
          this.ingredients = ingredients;
        });
  }

  fetchIngredientsFromDataSource() {
    this.httpClient.get<Ingredient[]>(this.url + 'fetch-all-ingredients')
      .subscribe((ingredients) => {
      this.ingredientsChanged.next(ingredients);
      this.ingredients = ingredients;
    });
  }

  addSingleIngredientToList(ingredient: Ingredient){
    console.log(JSON.stringify(ingredient));
    this.changeIngredientOrderList(ingredient, 'add-ingredient-order');
  }

  addMultipleIngredientsToList(ingredients: Ingredient[]) {
    this.httpClient
      .post(this.url+"add-multiple-ingredients", ingredients)
      .pipe(
        tap(() => {
          this.fetchIngredientsFromDataSource();
        })
      )
      .subscribe( response=>{
        console.log(response);
      });
  }

  updateSingleIngredient(ingredient: Ingredient) {
    this.changeIngredientOrderList(ingredient, 'update-single-ingredient');
  }


  changeIngredientOrderList(ingredient: Ingredient, urlEndpoint: string){
    this.httpClient
      .post(this.url+urlEndpoint, ingredient)
      .pipe(
        tap(() => {
          this.fetchIngredientsFromDataSource();
        })
      )
      .subscribe( response=>{
        console.log(response);
      });
  }

  removeIngredient(ingredient: Ingredient){
    this.httpClient
      .delete(this.url+'remove-ingredient', {
        body: ingredient
      })
      .pipe(
        tap(() => {
          this.fetchIngredientsFromDataSource();
        })
      )
      .subscribe( response=>{
        console.log(response);
      });
  }

  getIngredients() {
    this.fetchIngredientsFromDataSource();
    return this.ingredients.slice();
  }

  getIngredient(index: number){
    return this.ingredients[index];
  }

  addIngredient(ingredient: Ingredient){
    //this.ingredients.push(ingredient);
    this.addSingleIngredientToList(ingredient);
  }

  updateIngredient(index: number, newIngredient: Ingredient){
    //this.ingredients[index] = newIngredient;
    this.updateSingleIngredient(newIngredient);
  }
}
