import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { RecipesComponent } from './shared/components/recipes/recipes.component';
import { ShoppingListComponent } from './shared/components/shopping-list/shopping-list.component';
import { ShoppingListEditComponent } from './shared/components/shopping-list/shopping-list-edit/shopping-list-edit.component';
import {RouterModule} from "@angular/router";
import {AppRoutingModule} from "./app-routing.module";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatTableModule} from "@angular/material/table";
import { RecipeListComponent } from './shared/components/recipes/recipe-list/recipe-list.component';
import { RecipeDetailComponent } from './shared/components/recipes/recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from './shared/components/recipes/recipe-edit/recipe-edit.component';
import { RecipeItemComponent } from './shared/components/recipes/recipe-list/recipe-item/recipe-item.component';
import { RecipeStartComponent } from './shared/components/recipes/recipe-start/recipe-start.component';
import {RecipeService} from "./shared/services/recipe.service";
import {ShoppingListService} from "./shared/services/shopping-list.service";
import {DropdownDirective} from "./core/directives/dropdown.directive";
import {DataApiService} from "./shared/services/data-api.service";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatSortModule} from "@angular/material/sort";
import {MatInputModule} from "@angular/material/input";
import { CdkTableModule } from '@angular/cdk/table';
import { ProductListComponent } from './shared/components/product-list/product-list.component';
import {ProductListService} from "./shared/components/product-list/product-list.service";
import { DragDropListsComponent } from './shared/components/drag-drop-lists/drag-drop-lists.component';
import {MatCardModule} from "@angular/material/card";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {MatIconModule} from "@angular/material/icon";
import {CardComponent} from "./shared/components/cards/card-colors/card.component";
import {RecipeCardsListComponent} from "./shared/components/cards/recipe-cards-list/recipe-cards-list.component";
import { AuthComponent } from './shared/components/auth/auth.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { AuthInterceptorService } from './shared/components/auth/auth-interceptor.service';
import { AuthGuard } from './shared/components/auth/auth.guard';
import { AlertBoxComponent } from './shared/components/alert-box/alert-box.component';
import { SettingsComponent } from './shared/components/settings/settings.component';
import { SettingsService } from './shared/services/settings.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    RecipesComponent,
    ShoppingListComponent,
    ShoppingListEditComponent,
    RecipeListComponent,
    RecipeDetailComponent,
    RecipeEditComponent,
    RecipeItemComponent,
    RecipeStartComponent,
    DropdownDirective,
    ProductListComponent,
    DragDropListsComponent,
    CardComponent,
    RecipeCardsListComponent,
    AuthComponent,
    LoadingSpinnerComponent,
    AlertBoxComponent,
    SettingsComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatTableModule,
    MatPaginatorModule,
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSortModule,
    MatInputModule,
    CdkTableModule,
    MatCardModule,
    DragDropModule,
    MatIconModule
  ],
  providers: [
    RecipeService, 
    ShoppingListService, 
    DataApiService,
    SettingsService ,
    ProductListService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass:AuthInterceptorService,
      multi: true
    }, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
