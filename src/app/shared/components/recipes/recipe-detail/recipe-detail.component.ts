import { Component, OnInit } from '@angular/core';
import { Recipe } from '../../../models/recipe.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RecipeService } from '../../../services/recipe.service';
import { Subscription } from 'rxjs';
import { ShoppingListService } from '../../../services/shopping-list.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css'],
})
export class RecipeDetailComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService,
    private slService: ShoppingListService
  ) {}
  recipe: Recipe;
  displayedColumns: string[] = ['name', 'amount'];
  dataSource = new MatTableDataSource<any>();
  id: number;
  editMode = false;
  subscription: Subscription;
  ngOnInit(): void {
    this.subscription = this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.editMode = true;
      const recipe = this.recipeService.getRecipe(this.id);
      if (recipe) {
        this.recipe = recipe;
        this.dataSource.data = this.recipe.ingredients;
      } else {
        this.recipeService
          .getAllRecipesFromDataSource()
          .subscribe((recipes) => {
            this.recipe = this.recipeService.getRecipe(this.id);
            if (this.recipe) {
              this.dataSource.data = this.recipe.ingredients;
            } else {
              console.error('Recipe not found after refetch');
            }
          });
      }
    });
  }

  onAddToShoppingList() {
    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
  }

  onEditRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }


  onDeleteRecipe() {
    const currentId = this.recipe?.id;
    if (!currentId) return;
    // this.recipeService.deleteRecipe(currentId);
    // const subscription = this.recipeService.recipesChanged.subscribe((updatedRecipes) => {
    //   subscription.unsubscribe(); 

    //   if (updatedRecipes.length === 0) {
    //     this.router.navigate(['/recipes']);
    //   }
    //   const index = updatedRecipes.findIndex(
    //     r => 
    //       r.id === currentId
    //   );
  
    //   if (updatedRecipes.length === 0) {
    //     this.router.navigate(['/recipes']);
    //   } else if (index > 0) {
    //     this.router.navigate(['/recipes', this.id-1]);
    //   } else {
    //     this.router.navigate(['/recipes', 0]);
    //   }
    // });

      // Capture the index *before* deletion

  const sub = this.recipeService.recipesChanged.subscribe((updatedRecipes) => {
    sub.unsubscribe();

    if (updatedRecipes.length === 0) {
      this.router.navigate(['/recipes']);
    } else {
      // Prefer previous recipe if available, else fallback to first recipe
      const targetIndex = this.id > 0 ? this.id - 1 : 0;
      //const nextRecipe = updatedRecipes[targetIndex];

      this.router.navigate(['/recipes', targetIndex]);
    }
  });

  this.recipeService.deleteRecipe(currentId);
  }
  
}
