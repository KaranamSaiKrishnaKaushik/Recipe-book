import {Component, OnInit} from '@angular/core';
import {RecipeService} from "../../../services/recipe.service";
import {Recipe} from "../../../models/recipe.model";

@Component({
  selector: 'app-recipe-cards-list',
  templateUrl: './recipe-cards-list.component.html',
  styleUrls: ['./recipe-cards-list.component.css']
})
export class RecipeCardsListComponent implements OnInit {
  selectedCard: Recipe | any;
  constructor(private recipeService: RecipeService) {
  }

  recipes: Recipe[] = [];

  ngOnInit(): void {
    this.recipes = this.recipeService.getRecipes();

    this.recipeService.recipesChanged.subscribe((recipes: Recipe[]) => {
      this.recipes = recipes;
    });
  }

  onCardSelected(recipe: Recipe) {
    this.selectedCard = recipe;
    document.body.classList.add('no-scroll');
  }

  closeOverlay() {
    this.selectedCard = null;
    document.body.classList.remove('no-scroll');
  }

  printCard() {
    window.print();
  }

  truncate(text: string, words: number): string {
    return text.split(' ').slice(0, words).join(' ') + '...';
  }

}
