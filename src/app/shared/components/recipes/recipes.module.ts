import { NgModule } from "@angular/core";
import { RecipeDetailComponent } from "./recipe-detail/recipe-detail.component";
import { RecipeEditComponent } from "./recipe-edit/recipe-edit.component";
import { RecipeItemComponent } from "./recipe-list/recipe-item/recipe-item.component";
import { RecipeListComponent } from "./recipe-list/recipe-list.component";
import { RecipeStartComponent } from "./recipe-start/recipe-start.component";
import { RecipesComponent } from "./recipes.component";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatTableModule } from "@angular/material/table";
import { RecipesRoutingModule } from "./recipes-routing.module";
import { DropdownDirective } from "src/app/core/directives/dropdown.directive";
import { SharedModule } from "../../shared.module";
import { CommonModule } from "@angular/common";

@NgModule({
    declarations: [
       RecipesComponent,
       RecipeListComponent,
       RecipeDetailComponent,
       RecipeEditComponent,
       RecipeItemComponent,
       RecipeStartComponent,
       DropdownDirective,
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatTableModule,
        RouterModule,
        RecipesRoutingModule,
        CommonModule,
        SharedModule
    ],
    exports: [
       RecipesComponent,
       RecipeListComponent,
       RecipeDetailComponent,
       RecipeEditComponent,
       RecipeItemComponent,
       RecipeStartComponent,
       DropdownDirective,
    ]
})
export class RecipesModule {}