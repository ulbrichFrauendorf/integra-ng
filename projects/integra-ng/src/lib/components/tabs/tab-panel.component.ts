import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { UniqueComponentId } from '../../utils/uniquecomponentid';

/**
 * Tab Panel Component
 *
 * Represents an individual tab panel within an ITabs container.
 * Content is projected and displayed when the tab is selected.
 *
 * @example
 * ```html
 * <i-tab-panel header="Profile" icon="pi pi-user">
 *   <p>Profile content here</p>
 * </i-tab-panel>
 * ```
 */
@Component({
  selector: 'i-tab-panel',
  standalone: true,
  template: `
    <ng-template #content>
      <ng-content></ng-content>
    </ng-template>
  `,
})
export class ITabPanel {
  /**
   * Text label for the tab header
   */
  @Input() header?: string;

  /**
   * Icon class for the tab header (e.g., 'pi pi-home')
   */
  @Input() icon?: string;

  /**
   * Whether the tab is disabled
   * @default false
   */
  @Input() disabled = false;

  /**
   * Whether the tab can be closed
   * @default false
   */
  @Input() closable = false;

  /**
   * Reference to the tab content template
   * @internal
   */
  @ViewChild('content', { static: true }) contentTemplate!: TemplateRef<unknown>;

  /**
   * Unique identifier for this tab panel
   * @internal
   */
  componentId = UniqueComponentId('i-tab-panel-');
}
