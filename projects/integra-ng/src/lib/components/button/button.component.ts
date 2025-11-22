import { NgClass } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  AfterViewInit,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { UniqueComponentId } from '../../utils/uniquecomponentid';
import { ISeverity } from '@shared/enums/IButtonSeverity';

export type IButtonSize = 'xtra-small' | 'small' | 'medium' | 'large';

@Component({
  selector: 'i-button',
  standalone: true,
  imports: [NgClass],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class IButton implements AfterViewInit {
  @Input() severity: ISeverity = 'primary';
  @Input() size: IButtonSize = 'medium';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() outlined = false;
  @Input() raised = false;
  @Input() text = false;
  @Input() icon?: string;
  @Input() fluid = false;
  @Output() clicked = new EventEmitter<Event>();
  @ViewChild('projected', { read: ElementRef })
  projected?: ElementRef<HTMLElement>;
  iconOnly = false;

  componentId = UniqueComponentId('i-button-');

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    var text = this.projected?.nativeElement?.textContent;
    const hasProjected = text && text.trim()?.length > 0;
    this.iconOnly = !!this.icon && !hasProjected;
    // Trigger change detection to ensure CSS classes are applied correctly
    this.cdr.detectChanges();
  }
}
