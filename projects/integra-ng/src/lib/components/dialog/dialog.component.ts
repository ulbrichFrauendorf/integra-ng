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

@Component({
  selector: 'i-dialog',
  imports: [CommonModule, ICard],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class IDialog extends AbstractDialog implements OnInit, OnDestroy {
  @ViewChild('dialogElement', { static: false }) dialogElement?: ElementRef;

  componentId = UniqueComponentId('i-dialog-');

  constructor(private cdr: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    if (this.visible) {
      this.show();
    }
  }

  ngOnDestroy() {
    this.hide();
  }

  show() {
    this.visible = true;
    this.visibleChange.emit(true);
    document.body.style.overflow = 'hidden';
    this.cdr.detectChanges();
  }

  hide() {
    this.visible = false;
    this.visibleChange.emit(false);
    document.body.style.overflow = '';
  }

  @HostListener('document:keydown.escape')
  onEscapeKey() {
    if (this.closable && this.visible) {
      this.hide();
    }
  }

  onOverlayClick(event: Event) {
    if (this.modal && event.target === event.currentTarget && this.closable) {
      this.hide();
    }
  }

  onCloseClick() {
    if (this.closable) {
      this.hide();
    }
  }
}
