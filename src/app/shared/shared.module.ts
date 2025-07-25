import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AlertBoxComponent } from "../core/alert-box/alert-box.component";

@NgModule({
    declarations: [
        AlertBoxComponent
        //LoadingSpinnerComponent,
    ],
    imports: [
        CommonModule
    ],
    exports: [
        AlertBoxComponent,
        //LoadingSpinnerComponent,
    ]
})
export class SharedModule {

}