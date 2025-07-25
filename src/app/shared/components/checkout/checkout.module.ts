import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { CheckoutAddressComponent } from "./checkout-address/checkout-address.component";
import { CheckoutPaymentComponent } from "./checkout-payment/checkout-payment.component";
import { CheckoutProgressComponent } from "./checkout-progress/checkout-progress.component";
import { CheckoutReviewComponent } from "./checkout-review/checkout-review.component";
import { PaymentSuccessComponent } from "./payment-success/payment-success.component";
import { CommonModule } from "@angular/common";

@NgModule({
    declarations: [
        CheckoutAddressComponent,
            CheckoutPaymentComponent,
            CheckoutReviewComponent,
            CheckoutProgressComponent,
            PaymentSuccessComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule.forChild([
            { path: 'checkout', redirectTo: 'checkout/address', pathMatch: 'full' },
            {
                path: '', // 'checkout'
                children: [
                  { path: 'address', component: CheckoutAddressComponent },
                  { path: 'payment', component: CheckoutPaymentComponent },
                  { path: 'review', component: CheckoutReviewComponent },
                  { path: 'payment-success', component: PaymentSuccessComponent},
                ]
              }
        ])
    ],
    exports: [
        CheckoutAddressComponent,
            CheckoutPaymentComponent,
            CheckoutReviewComponent,
            CheckoutProgressComponent,
            PaymentSuccessComponent
    ]
})
export class CheckoutModule{}