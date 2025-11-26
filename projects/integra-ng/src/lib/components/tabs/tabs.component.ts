import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  AfterContentInit,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  Output,
  QueryList,
} from '@angular/core';
import { UniqueComponentId } from '../../utils/uniquecomponentid';
import { ITabPanel } from './tab-panel.component';

/**
 * Event data for tab change events
 */
export interface TabChangeEvent {
  /** The original browser event */
  originalEvent: Event;
  /** The index of the newly selected tab */
  index: number;
}

/**
 * Event data for tab close events
 */
export interface TabCloseEvent {
  /** The original browser event */
  originalEvent: Event;
  /** The index of the closed tab */
  index: number;
}

/**
 * Tabs Component
 *
 * A tabbed interface component that displays content panels based on user selection.
 * Supports icon-only, text-only, and icon + text tabs.
 *
 * @example
 * ```html
 * <!-- Icon + Text tabs -->
 * <i-tabs [(activeIndex)]="activeTab">
 *   <i-tab-panel header="Home" icon="pi pi-home">
 *     <p>Home content</p>
 *   </i-tab-panel>
 *   <i-tab-panel header="Profile" icon="pi pi-user">
 *     <p>Profile content</p>
 *   </i-tab-panel>
 * </i-tabs>
 *
 * <!-- Icon only tabs -->
 * <i-tabs [(activeIndex)]="activeTab">
 *   <i-tab-panel icon="pi pi-home">
 *     <p>Home content</p>
 *   </i-tab-panel>
 * </i-tabs>
 *
 * <!-- Text only tabs -->
 * <i-tabs [(activeIndex)]="activeTab">
 *   <i-tab-panel header="Tab 1">
 *     <p>Tab 1 content</p>
 *   </i-tab-panel>
 * </i-tabs>
 * ```
 */
@Component({
  selector: 'i-tabs',
  standalone: true,
  imports: [NgClass, NgTemplateOutlet],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
})
export class ITabs implements AfterContentInit {
  /**
   * Index of the currently active tab
   * @default 0
   */
  @Input() activeIndex = 0;

  /**
   * Emits when the active tab index changes (for two-way binding)
   */
  @Output() activeIndexChange = new EventEmitter<number>();

  /**
   * Emits when a tab is selected
   */
  @Output() onChange = new EventEmitter<TabChangeEvent>();

  /**
   * Emits when a closable tab is closed
   */
  @Output() onClose = new EventEmitter<TabCloseEvent>();

  /**
   * Collection of tab panel components
   * @internal
   */
  @ContentChildren(ITabPanel) tabs!: QueryList<ITabPanel>;

  /**
   * Unique component identifier
   * @internal
   */
  componentId = UniqueComponentId('i-tabs-');

  /**
   * Internal array of tab panels for iteration
   * @internal
   */
  tabPanels: ITabPanel[] = [];

  ngAfterContentInit(): void {
    this.tabPanels = this.tabs.toArray();
    this.tabs.changes.subscribe(() => {
      this.tabPanels = this.tabs.toArray();
    });
  }

  /**
   * Handles tab selection
   * @param event - The browser event
   * @param index - Index of the selected tab
   * @internal
   */
  selectTab(event: Event, index: number): void {
    const tab = this.tabPanels[index];
    if (tab && !tab.disabled) {
      this.activeIndex = index;
      this.activeIndexChange.emit(index);
      this.onChange.emit({ originalEvent: event, index });
    }
  }

  /**
   * Handles tab close action
   * @param event - The browser event
   * @param index - Index of the tab to close
   * @internal
   */
  closeTab(event: Event, index: number): void {
    event.stopPropagation();
    this.onClose.emit({ originalEvent: event, index });
  }

  /**
   * Handles keyboard navigation
   * @param event - The keyboard event
   * @param index - Current tab index
   * @internal
   */
  onKeyDown(event: KeyboardEvent, index: number): void {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        this.navigateToPreviousTab(index);
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.navigateToNextTab(index);
        break;
      case 'Home':
        event.preventDefault();
        this.navigateToFirstTab();
        break;
      case 'End':
        event.preventDefault();
        this.navigateToLastTab();
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.selectTab(event, index);
        break;
    }
  }

  /**
   * Navigate to the previous enabled tab
   * @internal
   */
  private navigateToPreviousTab(currentIndex: number): void {
    let newIndex = currentIndex - 1;
    while (newIndex >= 0) {
      if (!this.tabPanels[newIndex].disabled) {
        this.focusTab(newIndex);
        return;
      }
      newIndex--;
    }
    // Wrap to end
    newIndex = this.tabPanels.length - 1;
    while (newIndex > currentIndex) {
      if (!this.tabPanels[newIndex].disabled) {
        this.focusTab(newIndex);
        return;
      }
      newIndex--;
    }
  }

  /**
   * Navigate to the next enabled tab
   * @internal
   */
  private navigateToNextTab(currentIndex: number): void {
    let newIndex = currentIndex + 1;
    while (newIndex < this.tabPanels.length) {
      if (!this.tabPanels[newIndex].disabled) {
        this.focusTab(newIndex);
        return;
      }
      newIndex++;
    }
    // Wrap to beginning
    newIndex = 0;
    while (newIndex < currentIndex) {
      if (!this.tabPanels[newIndex].disabled) {
        this.focusTab(newIndex);
        return;
      }
      newIndex++;
    }
  }

  /**
   * Navigate to the first enabled tab
   * @internal
   */
  private navigateToFirstTab(): void {
    for (let i = 0; i < this.tabPanels.length; i++) {
      if (!this.tabPanels[i].disabled) {
        this.focusTab(i);
        return;
      }
    }
  }

  /**
   * Navigate to the last enabled tab
   * @internal
   */
  private navigateToLastTab(): void {
    for (let i = this.tabPanels.length - 1; i >= 0; i--) {
      if (!this.tabPanels[i].disabled) {
        this.focusTab(i);
        return;
      }
    }
  }

  /**
   * Focus a specific tab header
   * @internal
   */
  private focusTab(index: number): void {
    const tabElement = document.getElementById(
      `${this.componentId}-tab-${index}`
    );
    if (tabElement) {
      tabElement.focus();
    }
  }

  /**
   * Get the aria-labelledby attribute for a tab panel
   * @internal
   */
  getTabId(index: number): string {
    return `${this.componentId}-tab-${index}`;
  }

  /**
   * Get the id for a tab panel content
   * @internal
   */
  getPanelId(index: number): string {
    return `${this.componentId}-panel-${index}`;
  }
}
