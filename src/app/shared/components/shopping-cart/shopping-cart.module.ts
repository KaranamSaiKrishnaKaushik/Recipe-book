import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ShoppingCartComponent } from "./shopping-cart.component";
import { CommonModule } from "@angular/common";

@NgModule({
    declarations: [ShoppingCartComponent],
    imports: [
        CommonModule,
        //BrowserAnimationsModule,
        RouterModule.forChild([
            { path: '', component: ShoppingCartComponent }
            //'cart'
        ])
    ],
   // exports: [ShoppingCartComponent]
})
export class ShoppingCartModule {}