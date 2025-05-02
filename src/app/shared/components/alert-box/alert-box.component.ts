import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-alert-box',
  templateUrl: './alert-box.component.html',
  styleUrls: ['./alert-box.component.css']
})
export class AlertBoxComponent {
  @Input() message: string = ''; // Message to display in the alert box
  @Input() type: string = 'success'; // Alert type: success, error, info, warning
  @Input() duration: number = 5000; // Duration in milliseconds to show the alert
  
  showAlert: boolean = true; // To control the visibility of the alert

  ngOnInit() {
    setTimeout(() => {
      this.showAlert = false;
    }, this.duration);
  }
  
  closeAlert() {
    this.showAlert = false; // Manually close the alert
  }
}
