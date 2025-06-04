import {Component, OnInit} from '@angular/core';
import {Recipe} from "../../../models/recipe.model";
import {RecipeService} from "../../../services/recipe.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {

  constructor(private recipeService: RecipeService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  recipes: Recipe[];
  subscription: Subscription;

  showImportModal = false;
  importedRecipes: Recipe[] = [];
  importError: string | null = null;
  parsedRecipes: Recipe[] | null = null;
  jsonError: string | null = null;
  fileContent: string | null = null;
  isLoading = false;

  ngOnInit(): void {
    setTimeout(() => {
      if(this.recipes.length===0){
        this.isLoading= true;
      }
    }, 1000);
    this.recipes = this.recipeService.getRecipes();
    this.recipeService.recipesChanged.subscribe((recipes: Recipe[]) => {
      this.isLoading= false;
      this.recipes = recipes;
    })
    console.log(this.recipes);
    console.log('Hello here is the recipes list');
  }

  onNewRecipe() {
    console.log(this.route.snapshot.url);
    this.router.navigate(['new'], {relativeTo: this.route})
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          this.fileContent = reader.result as string;
          const json = JSON.parse(reader.result as string);
          if (Array.isArray(json)) {
            this.importedRecipes = json;
            this.importError = null;
          } else {
            throw new Error();
          }
        } catch {
          this.importError = 'Failure in conversion';
        }
      };
      reader.readAsText(file);
      console.log('Imported Recipes', this.importedRecipes);
    } else {
      this.importError = 'Please upload a valid JSON file';
    }
  }

  onFileDropped(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result as string);
        if (Array.isArray(json)) {
          this.parsedRecipes = json;
          this.jsonError = null;
        } else {
          throw new Error("Invalid format: Not an array.");
        }
      } catch (e) {
        this.parsedRecipes = null;
        this.jsonError = 'Failed to convert file to Recipe list. Please check the format.';
      }
    };
    reader.readAsText(file);
  }

  onImportRecipes() {
    if (!this.fileContent) {
      this.importError = 'No JSON content found';
      return;
    }

    try {
      const parsed = JSON.parse(this.fileContent);
      if (!Array.isArray(parsed)) throw new Error();
  
      this.recipeService.addAllRecipes(parsed).subscribe(
        () => {
          this.recipeService.fetchRecipesFromDataSource();
          this.showImportModal = false;
        },
        (error) => {
          this.importError = 'Error importing recipes';
          console.error(error);
        }
      );
    } catch (err) {
      this.importError = 'Invalid JSON format. Please correct it and try again.';
    }
  }

  copyJson() {
  const jsonElement = document.getElementById('jsonPrompt');
  if (jsonElement) {
    const text = jsonElement.innerText;
    navigator.clipboard.writeText(text).then(() => {
      alert('JSON copied to clipboard!');
    }).catch(err => {
      alert('Failed to copy JSON.');
      console.error(err);
    });
  }
}


  jsonExample: string = `[
  {
    "name": "Margherita Pizza",
    "description": "A classic Italian pizza topped with fresh tomatoes, mozzarella cheese, and fragrant basil leaves.",
    "imagePath": "https://media.istockphoto.com/...",
    "instructions": "1. Make pizza dough and rest for 1 hour. ...",
    "category": "Pizza",
    "ingredients": [
      { "baseName": { "name": "Mozzarella" }, "amount": 2 },
      { "baseName": { "name": "Tomato Sauce" }, "amount": 1 }
    ]
  },
  {
    "name": "Pepperoni Pizza",
    "description": "An all-time favorite with melted cheese...",
    "imagePath": "https://as2.ftcdn.net/...",
    "instructions": "1. Prepare dough. 2. Preheat oven...",
    "category": "Pizza",
    "ingredients": [
      { "baseName": { "name": "Pepperoni" }, "amount": 20 },
      { "baseName": { "name": "Mozzarella" }, "amount": 2 }
    ]
  }
]`;

}
