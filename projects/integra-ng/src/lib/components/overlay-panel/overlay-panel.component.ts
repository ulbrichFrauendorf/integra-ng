import { NgClass, NgStyle } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { IButton } from 'integra-ng';

/**
 * Overlay Panel Component
 *
 * A floating panel that positions itself relative to a target element.
 * Supports automatic collision detection and positioning, with optional close button
 * and dismissable behavior.
 *
 * @example
 * ```html
 * <!-- Basic overlay panel -->
 * <i-button (clicked)="panel.toggle($event)">Show Panel</i-button>
 * <i-overlay-panel #panel>
 *   <p>Panel content goes here</p>
 * </i-overlay-panel>
 *
 * <!-- With close button and custom position -->
 * <i-button (clicked)="panel2.toggle($event)">Show Panel</i-button>
 * <i-overlay-panel #panel2 [showCloseButton]="true" position="top">
 *   <p>This panel opens above the button</p>
 * </i-overlay-panel>
 * ```
 *
 * @remarks
 * - Automatically positions itself to avoid viewport overflow
 * - Supports keyboard navigation (Escape to close)
 * - Click outside to dismiss (when dismissable is true)
 * - Includes arrow pointer to target element
 */
@Component({
  selector: 'i-overlay-panel',
  standalone: true,
  imports: [NgClass, NgStyle, IButton],
  templateUrl: './overlay-panel.component.html',
  styleUrls: ['./overlay-panel.component.scss'],
})
export class IOverlayPanel {
  /**
   * Whether to show a close button in the top-right corner
   * @default false
   */
  @Input() showCloseButton = false;

  /**
   * Whether the panel can be dismissed by clicking outside or pressing Escape
   * @default true
   */
  @Input() dismissable = true;

  /**
   * Preferred position relative to the target element
   * Auto will choose the best position based on available space
   * @default auto
   */
  @Input() position: 'top' | 'bottom' | 'left' | 'right' | 'auto' = 'auto';

  /**
   * Event emitted when visibility changes
   */
  @Output() visibleChange = new EventEmitter<boolean>();

  @ViewChild('panel', { static: false }) panelElement?: ElementRef;

  visible = false;
  private targetElement?: HTMLElement;
  private documentClickListener?: (event: Event) => void;

  positionStyle: { [key: string]: string } = {};
  arrowStyle: { [key: string]: string } = {};
  arrowPosition: 'top' | 'bottom' | 'left' | 'right' = 'bottom';

  toggle(event: MouseEvent | Event) {
    if (this.visible) {
      this.hide();
    } else {
      this.show(event);
    }
  }

  show(event: MouseEvent | Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.targetElement = (event.target || event.currentTarget) as HTMLElement;
    this.visible = true;
    this.visibleChange.emit(this.visible);

    setTimeout(() => {
      this.align();
      this.bindDocumentClickListener();
    }, 0);
  }

  hide() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.unbindDocumentClickListener();
  }

  private align() {
    if (!this.panelElement || !this.targetElement) {
      return;
    }

    const panel = this.panelElement.nativeElement;
    const target = this.targetElement.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    const panelWidth = panel.offsetWidth;
    const panelHeight = panel.offsetHeight;
    const arrowSize = 8;

    let finalPosition: 'top' | 'bottom' | 'left' | 'right' =
      this.position === 'auto' ? 'bottom' : this.position;

    if (this.position === 'auto') {
      const spaceBelow = viewport.height - target.bottom;
      const spaceAbove = target.top;
      const spaceRight = viewport.width - target.right;
      const spaceLeft = target.left;

      if (spaceBelow >= panelHeight + arrowSize) {
        finalPosition = 'bottom';
      } else if (spaceAbove >= panelHeight + arrowSize) {
        finalPosition = 'top';
      } else if (spaceRight >= panelWidth + arrowSize) {
        finalPosition = 'right';
      } else if (spaceLeft >= panelWidth + arrowSize) {
        finalPosition = 'left';
      } else {
        finalPosition = 'bottom';
      }
    }

    this.arrowPosition = this.getOppositePosition(finalPosition);

    switch (finalPosition) {
      case 'bottom':
        this.positionStyle = {
          top: `${target.bottom + arrowSize + window.scrollY}px`,
          left: `${
            target.left + target.width / 2 - panelWidth / 2 + window.scrollX
          }px`,
        };
        this.arrowStyle = {
          left: '50%',
          transform: 'translateX(-50%)',
        };
        break;
      case 'top':
        this.positionStyle = {
          top: `${target.top - panelHeight - arrowSize + window.scrollY}px`,
          left: `${
            target.left + target.width / 2 - panelWidth / 2 + window.scrollX
          }px`,
        };
        this.arrowStyle = {
          left: '50%',
          transform: 'translateX(-50%)',
        };
        break;
      case 'left':
        this.positionStyle = {
          top: `${
            target.top + target.height / 2 - panelHeight / 2 + window.scrollY
          }px`,
          left: `${target.left - panelWidth - arrowSize + window.scrollX}px`,
        };
        this.arrowStyle = {
          top: '50%',
          transform: 'translateY(-50%)',
        };
        break;
      case 'right':
        this.positionStyle = {
          top: `${
            target.top + target.height / 2 - panelHeight / 2 + window.scrollY
          }px`,
          left: `${target.right + arrowSize + window.scrollX}px`,
        };
        this.arrowStyle = {
          top: '50%',
          transform: 'translateY(-50%)',
        };
        break;
    }

    const left = parseFloat(this.positionStyle['left']);
    const top = parseFloat(this.positionStyle['top']);

    if (left + panelWidth > viewport.width + window.scrollX) {
      this.positionStyle['left'] = `${
        viewport.width + window.scrollX - panelWidth - 10
      }px`;
    }
    if (left < window.scrollX) {
      this.positionStyle['left'] = `${window.scrollX + 10}px`;
    }
    if (top + panelHeight > viewport.height + window.scrollY) {
      this.positionStyle['top'] = `${
        viewport.height + window.scrollY - panelHeight - 10
      }px`;
    }
    if (top < window.scrollY) {
      this.positionStyle['top'] = `${window.scrollY + 10}px`;
    }
  }

  private getOppositePosition(
    position: 'top' | 'bottom' | 'left' | 'right'
  ): 'top' | 'bottom' | 'left' | 'right' {
    switch (position) {
      case 'top':
        return 'bottom';
      case 'bottom':
        return 'top';
      case 'left':
        return 'right';
      case 'right':
        return 'left';
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: Event) {
    if (this.visible && this.dismissable) {
      this.hide();
      const keyboardEvent = event as KeyboardEvent;
      if (typeof keyboardEvent.preventDefault === 'function') {
        keyboardEvent.preventDefault();
      }
    }
  }

  private bindDocumentClickListener() {
    if (!this.documentClickListener && this.dismissable) {
      this.documentClickListener = (event: Event) => {
        const target = event.target as HTMLElement | null;
        if (!target) {
          return;
        }

        const panel = this.panelElement?.nativeElement;

        if (
          panel &&
          !panel.contains(target) &&
          this.targetElement &&
          !this.targetElement.contains(target)
        ) {
          this.hide();
        }
      };
      document.addEventListener('click', this.documentClickListener);
    }
  }

  private unbindDocumentClickListener() {
    if (this.documentClickListener) {
      document.removeEventListener('click', this.documentClickListener);
      this.documentClickListener = undefined;
    }
  }
}
