import {PreloadAllModules, RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
const appRoutes : Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full'},
  { path: 'auth', loadChildren: () => import('./shared/components/auth/authentication.module').then(m => m.AuthenticationModule) },
  { path: 'recipes', loadChildren: () => import('./shared/components/recipes/recipes.module').then(m => m.RecipesModule) },
  { path: 'shopping-list', loadChildren: () => import('./shared/components/shopping-list/shopping-list.module').then(m => m.ShoppingListModule) },
  { path: 'settings', loadChildren: () => import('./shared/components/settings/settings.module').then(m => m.SettingsModule) },
  { path: 'checkout', loadChildren: () => import('./shared/components/checkout/checkout.module').then(m => m.CheckoutModule) },
  { path: 'overview', loadChildren: () => import('./shared/components/cards/overview.module').then(m => m.OverviewModule) },
  { path: 'product-list', loadChildren: () => import('./shared/components/product-list/product-list.module').then(m => m.ProductListModule) },
  { path: 'cart', loadChildren: () => import('./shared/components/shopping-cart/shopping-cart.module').then(m => m.ShoppingCartModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule{

}
