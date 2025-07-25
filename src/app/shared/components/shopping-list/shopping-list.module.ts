import { NgModule } from "@angular/core";
import { ShoppingListEditComponent } from "./shopping-list-edit/shopping-list-edit.component";
import { ShoppingListComponent } from "./shopping-list.component";
import { CdkTableModule } from "@angular/cdk/table";
import { FormsModule} from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { NgChartsModule } from "ng2-charts";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../shared.module";

@NgModule({
    declarations: [
        ShoppingListComponent,
        ShoppingListEditComponent],
    imports: [
        FormsModule,
        MatSlideToggleModule,
        MatTableModule,
        MatPaginatorModule,
        //BrowserAnimationsModule,
        MatSortModule,
        MatInputModule,
        CdkTableModule,
        NgChartsModule,
        CommonModule,
        RouterModule.forChild([
            { path: '', component: ShoppingListComponent} // shopping-list
        ])
    ],
    exports: [
        ShoppingListComponent,
        ShoppingListEditComponent
    ]
})
export class ShoppingListModule{

}