import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'i-chip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IChip {
  @Input() label?: string;
  @Input() icon?: string;
  @Input() image?: string;
  @Input() removable = false;
  @Input() removeIcon = 'pi pi-times-circle';
  @Input() styleClass?: string;
  @Input() disabled = false;

  @Output() onRemove = new EventEmitter<Event>();

  onRemoveClick(event: Event) {
    if (!this.disabled) {
      this.onRemove.emit(event);
    }
  }
}
