import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "src/app/app-routing.module";
import { HeaderComponent } from "./header.component";

@NgModule({
    declarations: [HeaderComponent],
    imports:[
        AppRoutingModule,
        //BrowserAnimationsModule,
    ],
    exports: [HeaderComponent]
})
export class HeaderModule{}