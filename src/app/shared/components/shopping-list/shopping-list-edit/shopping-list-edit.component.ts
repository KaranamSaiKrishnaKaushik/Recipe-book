import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from "@angular/forms";
import {Ingredient} from "../../../models/ingredient.model";
import {ShoppingListService} from "../../../services/shopping-list.service";
import {IngredientIdentity} from "../../../models/ingredient-identity.model";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-shopping-list-edit',
  templateUrl: './shopping-list-edit.component.html',
  styleUrls: ['./shopping-list-edit.component.css']
})
export class ShoppingListEditComponent implements OnInit {

  constructor(private slService: ShoppingListService) { }
  @ViewChild('f') slForm: NgForm;
  editMode= false;
  editItemIndex: number;
  editedItem: Ingredient;
  subscription: Subscription;
  ingredient: Ingredient;
  ngOnInit(): void {
    this.subscription = this.slService.startedEditing.subscribe(
      (index: number)=>{
        this.editItemIndex = index;
        this.editMode = true;
        this.editedItem = this.slService.ingredients[index];
        this.slForm.setValue({
          name: this.editedItem.baseName.name,
          amount: this.editedItem.amount
        })
      }
    );
  }

  onsubmit(form: NgForm){
   let recipeName = new IngredientIdentity(form.value.name);
   let recipeAmount = form.value.amount;
   this.ingredient = new Ingredient(recipeName,recipeAmount);
   if(this.editMode){
    this.slService.updateSingleIngredient(this.ingredient);
   }
   else {
     this.slService.addSingleIngredientToList(this.ingredient);
   }
  }


  onClear(){
    this.slForm.reset();
    this.editMode= false;
  }

  onDelete(form: NgForm){
    let recipeName = new IngredientIdentity(form.value.name);
    let recipeAmount = form.value.amount;
    this.ingredient = new Ingredient(recipeName,recipeAmount);
    if(this.editMode){
      this.slService.removeIngredient(this.ingredient);
    }
    //let index = this.slService.ingredients.findIndex(item => item.baseName.name === name);
  }

}
