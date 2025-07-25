import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { CardComponent } from "./card-colors/card.component";
import { RecipeCardsListComponent } from "./recipe-cards-list/recipe-cards-list.component";
import { CommonModule } from "@angular/common";

@NgModule({
    declarations: [CardComponent,
        RecipeCardsListComponent,],
    imports: [
        CommonModule,
         //BrowserAnimationsModule,
         RouterModule.forChild([
             { path: '', component: RecipeCardsListComponent}, //'overview'
         ])
    ],
    exports: [CardComponent,
        RecipeCardsListComponent,]
})
export class OverviewModule{}