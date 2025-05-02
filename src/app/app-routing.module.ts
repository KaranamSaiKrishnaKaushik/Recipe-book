import {RouterModule, Routes} from "@angular/router";
import {RecipesComponent} from "./shared/components/recipes/recipes.component";
import {ShoppingListComponent} from "./shared/components/shopping-list/shopping-list.component";
import {NgModule} from "@angular/core";
import {RecipeStartComponent} from "./shared/components/recipes/recipe-start/recipe-start.component";
import {RecipeDetailComponent} from "./shared/components/recipes/recipe-detail/recipe-detail.component";
import {RecipeEditComponent} from "./shared/components/recipes/recipe-edit/recipe-edit.component";
import {ProductListComponent} from "./shared/components/product-list/product-list.component";
import {DragDropListsComponent} from "./shared/components/drag-drop-lists/drag-drop-lists.component";
import {CardComponent} from "./shared/components/cards/card-colors/card.component";
import {RecipeCardsListComponent} from "./shared/components/cards/recipe-cards-list/recipe-cards-list.component";
import { AuthComponent } from "./shared/components/auth/auth.component";

const appRoutes : Routes = [

  { path: 'overview', component: RecipeCardsListComponent},
  { path: '', redirectTo: '/recipes', pathMatch: 'full'},
  { path: 'recipes', component: RecipesComponent,
    children: [
      { path: '', component: RecipeStartComponent},
      { path: 'new', component: RecipeEditComponent},
      { path: ':id', component: RecipeDetailComponent},
      { path: ':id/edit', component: RecipeEditComponent}
    ]
  },
  { path: 'shopping-list', component: ShoppingListComponent},
  { path: 'product-list', component: ProductListComponent},
  { path: 'drag-drop-list', component: DragDropListsComponent},
  { path: 'auth', component: AuthComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule{

}
