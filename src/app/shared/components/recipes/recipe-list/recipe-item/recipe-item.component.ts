import {Component, Input, OnInit} from '@angular/core';
import {Recipe} from "../../../../models/recipe.model";

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.css']
})
export class RecipeItemComponent implements OnInit {

  constructor() { }
  @Input() index: number;
  @Input() recipe: Recipe;
  ngOnInit(): void {
  }

}
