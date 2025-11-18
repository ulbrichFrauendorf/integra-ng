import { Component, Input, signal } from '@angular/core';

@Component({
  selector: 'i-empty-state',
  standalone: true,
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss',
})
export class EmptyStateComponent {
  @Input() fixed: boolean = false;
  @Input() colorScheme = signal<string>('light');
  imageLoaded: boolean = false;

  onImageLoad() {
    setTimeout(() => {
      this.imageLoaded = true;
    }, 200); // Delay before marking as loaded
  }
}
