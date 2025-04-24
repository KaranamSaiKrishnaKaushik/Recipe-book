import { Component, OnInit } from '@angular/core';
import {FormArray, FormControl, FormGroup} from "@angular/forms";
import {Subscription} from "rxjs";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {RecipeService} from "../../../services/recipe.service";
import {Recipe} from "../../../models/recipe.model";

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private router: Router,
              private recipeService: RecipeService) { }
  recipeForm : FormGroup;
  paramSubscription: Subscription;
  recipeSubscription: Subscription;
  editMode = false;
  id: number;
  ngOnInit(): void {
    this.paramSubscription = this.route.params.subscribe(
      (params: Params)=>{
        this.id = +params['id'];
        this.editMode = params['id']!= null;

        this.recipeSubscription = this.recipeService.recipesChanged.subscribe(() => {
          if (this.editMode) {
            this.initForm();
          }
        });

        if (this.recipeService.recipes.length === 0) {
          this.recipeService.fetchRecipesFromDataSource();
        } else {
          this.initForm();
        }
      }
    );
  }

  initForm(){
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeInstructions = '';
    let recipeCategory = '';
    let recipeIngredients = new FormArray([]);

    if(this.editMode){
        const recipe = this.recipeService.getRecipe(this.id);
        recipeName = recipe.name;
        recipeImagePath = recipe.imagePath;
        recipeDescription = recipe.description;
        recipeInstructions = recipe.instructions;
        recipeCategory = recipe.category;
        if(recipe.ingredients){
        for(let ingredient of recipe.ingredients){
          recipeIngredients.push(
            new FormGroup({
              'name': new FormControl(ingredient.baseName.name),
              'amount': new FormControl(ingredient.amount)
            })
          )
        }
      }
    }
    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName),
      'imagePath': new FormControl(recipeImagePath),
      'description': new FormControl(recipeDescription),
      'ingredients': recipeIngredients,
      'instructions': new FormControl(recipeInstructions),
      'category' : new FormControl(recipeCategory)
    })
  }

  get controls(){
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  onSubmit(){
    if(this.editMode){
      console.log(this.recipeForm.value);
    }else{
      this.recipeService.addRecipe(this.recipeForm.value);
    }
  }

  onAddIngredient(){
    (this.recipeForm.get('ingredients') as FormArray).push(
      new FormGroup({
        'name': new FormControl(null),
        'amount': new FormControl(null)
      })
    );
  }

  onCancel(){
    this.router.navigate(['../'], {relativeTo: this.route})
  }

  onDeleteIngredient(index: number){
    (this.recipeForm.get('ingredients') as FormArray).removeAt(index);
  }
}
