import { Component, OnInit } from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
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
  guid: any;
  showAlert: boolean = false;
  alertMessage: string = '';
  alertType: string = 'success';

  categoryOptions= [{ baseName: { name: 'Pizza' } }];
  categoryName: string = '';
  dropdownOpen: boolean = false;
  filteredOptions: any[] = [];

  submitted: boolean = false;

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
        this.initForm();
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
        this.guid = recipe.id;
        recipeName = recipe.name;
        recipeImagePath = recipe.imagePath;
        recipeDescription = recipe.description;
        recipeInstructions = recipe.instructions;
        recipeCategory = recipe.category;
        if(recipe.ingredients){
        for(let ingredient of recipe.ingredients){
          recipeIngredients.push(
            new FormGroup({
              baseName: new FormGroup({
                name: new FormControl(ingredient.baseName.name, Validators.required)
              }),
              amount: new FormControl(ingredient.amount, [
                Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*$/)
              ])
            })
          )
        }
      }
    }
    this.recipeForm = new FormGroup({
      id: new FormControl(this.guid),
      name: new FormControl(recipeName, Validators.required),
      imagePath: new FormControl(recipeImagePath, Validators.required),
      description: new FormControl(recipeDescription, Validators.required),
      ingredients: recipeIngredients,
      instructions: new FormControl(recipeInstructions, Validators.required),
      category : new FormControl(recipeCategory, Validators.required)
    });
    this.categoryName = recipeCategory;
  }

  get controls(){
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  onSubmit(){
    this.submitted = true;

    if (!this.recipeForm.valid) {
      return;
    }
    if(this.editMode){
      console.log(this.recipeForm.value);
      this.recipeService.updateRecipe(this.recipeForm.value);
      this.showAlert = true;
        this.alertMessage = 'Recipe updated successfully!';
        this.alertType = 'success';
        setTimeout(() => {
          this.router.navigate(['../'], { relativeTo: this.route });
        }, 2000);
    }else{
      console.log(this.recipeForm.value);
      this.recipeService.addRecipe(this.recipeForm.value);
    }
  }

  onAddIngredient(){
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
      baseName: new FormGroup({
        name: new FormControl(null, Validators.required)
      }),
      amount: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[1-9]+[0-9]*$/)
      ])
      })
    );
  }

  onCancel(){
    this.router.navigate(['../'], {relativeTo: this.route})
  }

  onDeleteIngredient(index: number){
    (this.recipeForm.get('ingredients') as FormArray).removeAt(index);
  }

  onCloseAlert() {
    this.showAlert = false;
  }

  filterOptions() {
    const query = this.categoryName.toLowerCase();
    this.filteredOptions = this.categoryOptions.filter(option =>
      option.baseName.name.toLowerCase().includes(query)
    );
  }
  
  selectOption(name: string) {
    this.categoryName = name;
    this.recipeForm.get('category')?.setValue(name);
    this.dropdownOpen = false;
  }
  
  closeDropdownWithDelay() {
    setTimeout(() => {
      this.dropdownOpen = false;
    }, 150);
  }
}
