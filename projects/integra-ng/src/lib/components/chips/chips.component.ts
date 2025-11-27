import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { IChip } from '../chip/chip.component';

export interface ChipItem {
  label: string;
  value: unknown;
  icon?: string;
  removable?: boolean;
  disabled?: boolean;
}

export interface ChipRemoveEvent {
  chip: ChipItem;
  originalEvent: Event;
}

@Component({
  selector: 'i-chips',
  standalone: true,
  imports: [CommonModule, IChip],
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IChipsComponent {
  @Input() chips: ChipItem[] = [];
  @Input() removable = true;
  @Input() disabled = false;

  @Output() removeChip = new EventEmitter<ChipRemoveEvent>();

  trackByValue(index: number, chip: ChipItem): unknown {
    return chip.value ?? index;
  }

  onChipRemove(chip: ChipItem, event: Event): void {
    if (this.disabled || chip.disabled || !(chip.removable ?? this.removable)) {
      return;
    }

    event.stopPropagation();
    this.removeChip.emit({ chip, originalEvent: event });
  }
}
