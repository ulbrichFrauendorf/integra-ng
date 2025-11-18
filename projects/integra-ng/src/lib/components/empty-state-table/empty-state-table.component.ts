import { Component, Input, signal } from '@angular/core';

@Component({
  selector: 'i-empty-state-table',
  standalone: true,
  templateUrl: './empty-state-table.component.html',
  styleUrl: './empty-state-table.component.scss',
})
export class EmptyStateTableComponent {
  @Input() colorScheme = signal<string>('light');
  imageLoaded: boolean = false;

  onImageLoad() {
    setTimeout(() => {
      this.imageLoaded = true;
    }, 200); // Delay before marking as loaded
  }
}
