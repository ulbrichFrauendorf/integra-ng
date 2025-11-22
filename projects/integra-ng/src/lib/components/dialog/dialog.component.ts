import {
  Component,
  HostListener,
  ElementRef,
  ViewChild,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICard } from '../card/card.component';
import { UniqueComponentId } from '../../utils/uniquecomponentid';
import { AbstractDialog } from './dialog-base';

/**
 * Dialog Component
 *
 * A modal dialog component for displaying content in an overlay.
 * Supports customizable header, dimensions, and close behavior.
 *
 * @example
 * ```html
 * <!-- Basic dialog -->
 * <i-dialog
 *   [(visible)]="displayDialog"
 *   header="Dialog Title">
 *   <p>Dialog content goes here</p>
 * </i-dialog>
 *
 * <!-- Dialog with custom width -->
 * <i-dialog
 *   [(visible)]="showDialog"
 *   header="Custom Size"
 *   width="30rem"
 *   height="20rem">
 *   <p>Content</p>
 * </i-dialog>
 *
 * <!-- Non-modal dialog -->
 * <i-dialog
 *   [(visible)]="displayDialog"
 *   [modal]="false"
 *   header="Non-Modal">
 *   <p>Click outside won't close this</p>
 * </i-dialog>
 *
 * <!-- Non-closable dialog -->
 * <i-dialog
 *   [(visible)]="displayDialog"
 *   [closable]="false"
 *   header="Cannot Close">
 *   <p>Must interact with dialog to close</p>
 *   <button (click)="displayDialog = false">OK</button>
 * </i-dialog>
 * ```
 *
 * @remarks
 * The dialog automatically manages body scroll lock when visible.
 * Press Escape to close if closable is true.
 */
@Component({
  selector: 'i-dialog',
  imports: [CommonModule, ICard],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class IDialog extends AbstractDialog implements OnInit, OnDestroy {
  /**
   * Reference to the dialog element for positioning and styling
   * @internal
   */
  @ViewChild('dialogElement', { static: false }) dialogElement?: ElementRef;

  /**
   * Unique component identifier
   * @internal
   */
  componentId = UniqueComponentId('i-dialog-');

  constructor(private cdr: ChangeDetectorRef) {
    super();
  }

  ngOnInit(): void {
    if (this.visible) {
      this.show();
    }
  }

  ngOnDestroy(): void {
    this.hide();
  }

  /**
   * Shows the dialog and locks body scroll
   */
  show(): void {
    this.visible = true;
    this.visibleChange.emit(true);
    document.body.style.overflow = 'hidden';
    this.cdr.detectChanges();
  }

  /**
   * Hides the dialog and unlocks body scroll
   */
  hide(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    document.body.style.overflow = '';
  }

  /**
   * Handles Escape key press to close dialog
   * @internal
   */
  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.closable && this.visible) {
      this.hide();
    }
  }

  /**
   * Handles overlay click to close modal dialog
   * @internal
   */
  onOverlayClick(event: Event): void {
    if (this.modal && event.target === event.currentTarget && this.closable) {
      this.hide();
    }
  }

  /**
   * Handles close button click
   * @internal
   */
  onCloseClick(): void {
    if (this.closable) {
      this.hide();
    }
  }
}
