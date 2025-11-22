import { Component, Input, signal } from '@angular/core';

/**
 * Empty State Table Component
 *
 * Specialized empty state component for displaying within tables.
 * Shows a relevant illustration when table data is empty.
 *
 * @example
 * ```html
 * <!-- In a table when no data -->
 * <table>
 *   <tbody>
 *     @if (data.length === 0) {
 *       <tr>
 *         <td colspan="100%">
 *           <i-empty-state-table></i-empty-state-table>
 *         </td>
 *       </tr>
 *     }
 *   </tbody>
 * </table>
 *
 * <!-- With dark theme -->
 * <i-empty-state-table [colorScheme]="darkModeSignal"></i-empty-state-table>
 * ```
 *
 * @remarks
 * This component is optimized for table layouts and provides
 * appropriate messaging and styling for empty table states.
 */
@Component({
  selector: 'i-empty-state-table',
  standalone: true,
  templateUrl: './empty-state-table.component.html',
  styleUrl: './empty-state-table.component.scss',
})
export class EmptyStateTableComponent {
  /**
   * Color scheme signal for theming
   * @default signal('light')
   */
  @Input() colorScheme = signal<string>('light');

  /**
   * Tracks whether the illustration image has loaded
   * @internal
   */
  imageLoaded: boolean = false;

  /**
   * Handles image load with a slight delay for smooth appearance
   * @internal
   */
  onImageLoad(): void {
    setTimeout(() => {
      this.imageLoaded = true;
    }, 200);
  }
}
