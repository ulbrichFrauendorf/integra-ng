import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICard } from '@shared/components/card/card.component';
import { CodeDisplayComponent } from '../code-display/code-display.component';

@Component({
  selector: 'app-demo-card',
  standalone: true,
  imports: [CommonModule, ICard, CodeDisplayComponent],
  template: `
    <h2>{{ title }}</h2>
    <i-card>
      <div class="demo-card-content">
        <div class="demo-section">
          <ng-content></ng-content>
        </div>
      </div>
    </i-card>
    @if (sourceCode) {
    <app-code-display [sourceCode]="sourceCode"></app-code-display>
    }
  `,
  styles: [
    `
      .demo-card-content {
        padding: 20px 0;
      }

      .demo-section {
        margin-bottom: 20px;
      }
    `,
  ],
})
export class DemoCardComponent {
  @Input() title!: string;
  @Input() sourceCode?: string;
}
