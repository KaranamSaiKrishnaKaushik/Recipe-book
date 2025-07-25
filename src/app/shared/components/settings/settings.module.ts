import { NgModule } from "@angular/core";
import { SettingsComponent } from "./settings.component";
import { RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../../shared.module";
import { CommonModule } from "@angular/common";

@NgModule({
    declarations: [SettingsComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        HttpClientModule,
        SharedModule,
        RouterModule.forChild([
            { path: '', component: SettingsComponent } //'settings'
        ])
    ],
    exports: [SettingsComponent]
})
export class SettingsModule{}