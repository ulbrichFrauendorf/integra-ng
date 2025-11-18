import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IButton } from '../button/button.component';
import { UniqueComponentId } from '../../utils/uniquecomponentid';

@Component({
  selector: 'i-card',
  imports: [IButton],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class ICard {
  @Input() title?: string;
  @Input() closable: boolean = false;
  @Output() closeCard = new EventEmitter<void>();

  componentId = UniqueComponentId('i-card-');

  onCloseCard() {
    this.closeCard.emit();
  }
}
