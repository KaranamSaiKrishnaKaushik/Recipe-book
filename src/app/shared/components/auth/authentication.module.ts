import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { AuthComponent } from "./auth.component";
import { LoadingSpinnerComponent } from "../../loading-spinner/loading-spinner.component";
import { FormsModule} from "@angular/forms";
import { SharedModule } from "../../shared.module";
import { CommonModule } from "@angular/common";

@NgModule({
    declarations: [
        AuthComponent,
        LoadingSpinnerComponent
    ],
    imports: [
            CommonModule,
            FormsModule,
            //BrowserAnimationsModule,
            RouterModule.forChild([
               { path: '', component: AuthComponent },
               //'auth'
            ]),
            //SharedModule
    ],
    exports: [
        AuthComponent,
        LoadingSpinnerComponent
    ]
})
export class AuthenticationModule{}