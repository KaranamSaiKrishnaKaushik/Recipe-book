import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { AuthGuard } from "@auth0/auth0-angular";
import { AuthInterceptorService } from "./shared/components/auth/auth-interceptor.service";
import { ProductListService } from "./shared/components/product-list/product-list.service";
import { DataApiService } from "./shared/services/data-api.service";
import { RecipeService } from "./shared/services/recipe.service";
import { SettingsService } from "./shared/services/settings.service";
import { ShoppingListService } from "./shared/services/shopping-list.service";

@NgModule({
    providers:[
         RecipeService, 
            ShoppingListService, 
            DataApiService,
            SettingsService ,
            ProductListService,
            {
              provide: HTTP_INTERCEPTORS,
              useClass:AuthInterceptorService,
              multi: true
            }, 
            AuthGuard
    ]
})
export class CoreModule{}