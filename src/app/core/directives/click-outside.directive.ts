import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appClickOutside]'
})
export class ClickOutsideDirective {
  @Output() clickOutside = new EventEmitter<void>();
  private isListening = false;

  constructor(private elRef: ElementRef) {
    // Wait a tick to avoid capturing the initial open click
    setTimeout(() => this.isListening = true, 0);
  }

  @HostListener('document:click', ['$event.target'])
  onClick(target: HTMLElement): void {
    if (!this.isListening) return;

    const clickedInside = this.elRef.nativeElement.contains(target);
    if (!clickedInside) {
      this.clickOutside.emit();
    }
  }
}
