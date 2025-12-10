import { Component } from '@angular/core';
import { DemoCardComponent } from '../demo-card/demo-card.component';
import {
  FeaturesListComponent,
  Feature,
} from '../features-list/features-list.component';
import { IProgressSpinner } from '@shared/components/progress-spinner/progress-spinner.component';
import { IButton } from '@shared/components/button/button.component';

@Component({
  selector: 'app-progress-spinners',
  imports: [
    IProgressSpinner,
    IButton,
    DemoCardComponent,
    FeaturesListComponent,
  ],
  templateUrl: './progress-spinners.component.html',
  styleUrls: [
    './progress-spinners.component.scss',
    '../shared-demo-styles.scss',
  ],
})
export class ProgressSpinnersComponent {
  // Loading state for button example
  isLoading = false;

  // Code examples organized by category
  codeExamples = {
    basic: `<!-- Default spinner (medium size) -->
<i-progress-spinner></i-progress-spinner>`,

    sizes: `<!-- Small spinner -->
<i-progress-spinner size="small"></i-progress-spinner>

<!-- Medium spinner (default) -->
<i-progress-spinner size="medium"></i-progress-spinner>

<!-- Large spinner -->
<i-progress-spinner size="large"></i-progress-spinner>`,

    strokeWidth: `<!-- Custom stroke width -->
<i-progress-spinner [strokeWidth]="2"></i-progress-spinner>
<i-progress-spinner [strokeWidth]="4"></i-progress-spinner>
<i-progress-spinner [strokeWidth]="6"></i-progress-spinner>`,

    accessibility: `<!-- With custom aria-label -->
<i-progress-spinner ariaLabel="Loading data"></i-progress-spinner>
<i-progress-spinner ariaLabel="Processing request"></i-progress-spinner>`,

    withButton: `<!-- Loading button with native loading state -->
<i-button
  [loading]="isLoading"
  (clicked)="simulateLoading()"
>
  {{ isLoading ? 'Loading...' : 'Click Me' }}
</i-button>`,

    severities: `<!-- Loading buttons automatically match severity colors -->
<!-- Filled buttons show white spinner -->
<i-button severity="primary" [loading]="true">Primary</i-button>
<i-button severity="success" [loading]="true">Success</i-button>
<i-button severity="danger" [loading]="true">Danger</i-button>

<!-- Outlined buttons show colored spinner -->
<i-button severity="primary" [outlined]="true" [loading]="true">Primary</i-button>
<i-button severity="success" [outlined]="true" [loading]="true">Success</i-button>
<i-button severity="danger" [outlined]="true" [loading]="true">Danger</i-button>`,

    inCard: `<!-- Loading state in a card -->
<div class="loading-card">
  @if (isLoading) {
    <div class="loading-overlay">
      <i-progress-spinner></i-progress-spinner>
      <p>Loading content...</p>
    </div>
  } @else {
    <div class="card-content">
      <h3>Card Content</h3>
      <p>This is your loaded content.</p>
    </div>
  }
</div>`,
  };

  tsExamples = {
    withButton: `export class ExampleComponent {
  isLoading = false;

  simulateLoading() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }
}`,
  };

  features: Feature[] = [
    {
      title: 'Size Variants',
      description:
        'Three size options: small (2rem), medium (4rem), and large (6rem)',
    },
    {
      title: 'Customizable Stroke',
      description: 'Adjustable stroke width for different visual weights',
    },
    {
      title: 'Smooth Animation',
      description: 'CSS-based rotating animation with consistent speed',
    },
    {
      title: 'Accessibility',
      description:
        'Includes role="status" and customizable aria-label for screen readers',
    },
    {
      title: 'Theme Integration',
      description: 'Uses theme primary color and adapts to light/dark themes',
    },
    {
      title: 'Inline Usage',
      description: 'Can be used inline with buttons, text, or other components',
    },
    {
      title: 'Overlay Support',
      description: 'Works well in loading overlays and full-page loaders',
    },
    {
      title: 'Lightweight',
      description: 'SVG-based with minimal markup and CSS',
    },
  ];

  // Simulate loading for button example
  simulateLoading() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }
}
