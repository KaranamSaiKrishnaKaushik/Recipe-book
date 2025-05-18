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
import { SettingsComponent } from "./shared/components/settings/settings.component";
import { ShoppingCartComponent } from "./shared/components/shopping-cart/shopping-cart.component";
import { CheckoutAddressComponent } from "./shared/components/checkout/checkout-address/checkout-address.component";
import { CheckoutPaymentComponent } from "./shared/components/checkout/checkout-payment/checkout-payment.component";
import { CheckoutReviewComponent } from "./shared/components/checkout/checkout-review/checkout-review.component";
import { PaymentSuccessComponent } from "./shared/components/checkout/payment-success/payment-success.component";

const appRoutes : Routes = [

  { path: 'overview', component: RecipeCardsListComponent},
  { path: '', redirectTo: '/auth', pathMatch: 'full'},
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
  { path: 'auth', component: AuthComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'cart', component: ShoppingCartComponent },
  { path: 'checkout', redirectTo: 'checkout/address', pathMatch: 'full' },
  {
    path: 'checkout',
    children: [
      { path: 'address', component: CheckoutAddressComponent },
      { path: 'payment', component: CheckoutPaymentComponent },
      { path: 'review', component: CheckoutReviewComponent },
      { path: 'payment-success', component: PaymentSuccessComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule{

}
