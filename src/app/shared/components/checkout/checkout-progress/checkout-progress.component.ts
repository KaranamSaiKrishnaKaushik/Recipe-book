import { Component, Input } from "@angular/core";

@Component({
  selector: 'app-checkout-progress',
  templateUrl: './checkout-progress.component.html',
  styleUrls: ['./checkout-progress.component.css']
})
export class CheckoutProgressComponent {
  @Input() currentStep: number = 1;
  steps = ['Cart', 'Address', 'Payment Method', 'Order'];
}