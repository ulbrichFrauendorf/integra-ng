import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type TooltipPosition = 'above' | 'below' | 'left' | 'right';

@Component({
  selector: 'i-tooltip',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="i-tooltip"
      [class.i-tooltip--above]="position === 'above'"
      [class.i-tooltip--below]="position === 'below'"
      [class.i-tooltip--left]="position === 'left'"
      [class.i-tooltip--right]="position === 'right'"
    >
      {{ text }}
      <div class="i-tooltip__arrow"></div>
    </div>
  `,
  styleUrl: './tooltip.component.scss',
})
export class TooltipComponent {
  @Input() text: string = '';
  @Input() position: TooltipPosition = 'above';
}
