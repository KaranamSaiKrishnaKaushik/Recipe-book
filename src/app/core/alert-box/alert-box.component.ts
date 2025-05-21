import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-alert-box',
  templateUrl: './alert-box.component.html',
  styleUrls: ['./alert-box.component.css']
})
export class AlertBoxComponent {
  @Input() message: string = ''; 
  @Input() type: string = 'success'; 
  @Input() duration: number = 5000;
  
  showAlert: boolean = true;

  ngOnInit() {
    setTimeout(() => {
      this.showAlert = false;
    }, this.duration);
  }
  
  closeAlert() {
    this.showAlert = false;
  }
}
