import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { ProductListComponent } from "./product-list.component";
import { CommonModule } from "@angular/common";

@NgModule({
    declarations: [ProductListComponent],
    imports: [
        FormsModule,
        CommonModule,
        //BrowserAnimationsModule,
        RouterModule.forChild([
            { path: '', component: ProductListComponent}, //'product-list'
        ])
    ],
    exports: [ProductListComponent]
})
export class ProductListModule{}